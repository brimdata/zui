import {remote} from "electron"
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
import refreshPoolNames from "src/js/flows/refreshPoolNames"
import ThreeDotsIcon from "src/js/icons/ThreeDotsIcon"
import {showContextMenu} from "src/js/lib/System"
import {AppDispatch} from "src/js/state/types"
import styled from "styled-components"
import SpaceMigrator from "./space-migrator"
import ToolbarButton from "./toolbar/button"

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
          x: x - 50, // this will need to change as we add more items
          y: y - 35 // this too
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
        dispatch(refreshPoolNames())
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
        if (spaces.needMigration()) {
          toast.error("Some spaces not migrated")
        } else {
          toast.success("Migration complete")
        }
      })
      .catch((e) => {
        toast.dismiss(id)
        toast.error(e)
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
        and the{" "}
        <Link href="https://github.com/brimdata/zed/blob/main/docs/lake/design.md">
          Zed Lake design
        </Link>
        .
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
const Wrap = styled.div`
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

function LoadingToast({title, message, onContextMenu}) {
  return (
    <Wrap>
      <div>
        <b>{title}</b>
        <br />
        {message}
      </div>
      <div>
        <Menu onClick={onContextMenu}>
          <ThreeDotsIcon />
        </Menu>
      </div>
    </Wrap>
  )
}
