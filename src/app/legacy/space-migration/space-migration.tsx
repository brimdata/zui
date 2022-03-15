import * as remote from "@electron/remote"
import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import {join} from "path"
import React, {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {useDispatch} from "react-redux"
import Link from "src/js/components/common/Link"
import useListener from "src/js/components/hooks/useListener"
import {
  ButtonGroup,
  Content,
  Footer,
  ModalDialog,
  Title
} from "src/js/components/ModalDialog/ModalDialog"
import deletePool from "src/js/flows/deletePool"
import ThreeDotsIcon from "src/js/icons/ThreeDotsIcon"
import {showContextMenu} from "src/js/lib/System"
import {AppDispatch} from "src/js/state/types"
import styled from "styled-components"
import ToolbarButton from "../../toolbar/button"
import SpaceMigrator from "./space-migrator"
import links from "src/app/core/links"

let src
let dst

async function needsToMigrate() {
  src = join(await remote.app.getPath("userData"), "data/spaces")
  dst = join(await remote.app.getPath("userData"), "data/brimcap-root")
  const spaces = new SpaceMigrator(src, dst)
  return spaces.needMigration()
}

export default function SpaceMigration() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    needsToMigrate().then((bool) => {
      if (bool) setOpen(true)
    })
  }, [])

  if (open)
    return <ModalDialog onClosed={() => setOpen(false)}>{Modal}</ModalDialog>
  else return null
}

function Modal({onClose}) {
  const dispatch = useDispatch<AppDispatch>()
  const spaces = new SpaceMigrator(src, dst)
  // @ts-ignore
  useListener(globalThis, "beforeunload", () => spaces.cancel())

  function onMigrate() {
    onClose()

    let id
    const onContextMenu = (e) => {
      const {x, y} = e.currentTarget.getBoundingClientRect()
      showContextMenu(
        [
          {
            label: "Cancel",
            click: () => {
              spaces.cancel()
              toast.dismiss(id)
            }
          }
        ],
        {
          x: Math.round(x - 50), // this will need to change as we add more items
          y: Math.round(y - 35) // this too
        }
      )
    }
    id = toast.loading(
      <LoadingToast
        title="Migrating Spaces"
        message="Starting..."
        onContextMenu={onContextMenu}
      />,
      {duration: 99999 * 1000}
    )

    spaces
      .migrate(({total, count, space}) => {
        dispatch(syncPoolsData())
        toast.loading(
          <LoadingToast
            title="Migrating Spaces"
            message={`${count} of ${total}: ${space}`}
            onContextMenu={onContextMenu}
          />,
          {id, duration: 99999 * 1000}
        )
      })
      .then(() => {
        toast.dismiss(id)
        // This is a bug in the toast library, these subsequent toasts
        // were not being displayed without the setTimeout()
        setTimeout(() => {
          if (spaces.needMigration()) {
            toast.error("Some spaces not migrated")
          } else {
            toast.success("Migration complete")
          }
        })
      })
      .catch((e) => {
        toast.dismiss(id)
        if ("currentPoolID" in e) {
          dispatch(deletePool(e.currentPoolID))
        }
        // This is a bug in the toast library, these subsequent toasts
        // were not being displayed without the setTimeout()
        setTimeout(() => {
          toast.error(e.message)
        })
      })
  }

  return (
    <Content width={420}>
      <Title>Migration Required</Title>
      <p>
        Brim now uses Data Pools in Zed Lakes for storage. Your Spaces must be
        migrated to Pools to continue querying them.
      </p>
      <p>
        Learn more about the{" "}
        <Link href="https://github.com/brimdata/brim/wiki/Migration-of-Spaces">
          migration tool
        </Link>{" "}
        and the <Link href={links.ZED_DOCS_ROOT}>Zed Lake design</Link>.
      </p>
      <Footer>
        <ButtonGroup>
          <ToolbarButton text="Later" onClick={onClose} />
          <ToolbarButton isPrimary text="Migrate" onClick={onMigrate} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}
const Wrap = styled.span`
  display: flex;
  margin-left: 10px;
  align-items: center;
  user-select: none;
`

const Menu = styled.button`
  background: none;
  border: none;
  width: 16px;
  display: flex;
  padding: 0;
  margin-left: 10px;
  svg {
    fill: rgba(255, 255, 255, 0.8);
  }

  &:hover svg {
    fill: white;
  }
`

const Block = styled.span`
  display: block;
`

function LoadingToast({title, message, onContextMenu}) {
  return (
    <Wrap>
      <Block>
        <b>{title}</b>
        <br />
        {message}
      </Block>
      <Block>
        <Menu onClick={onContextMenu}>
          <ThreeDotsIcon />
        </Menu>
      </Block>
    </Wrap>
  )
}
