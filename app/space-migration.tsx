import React, {useEffect, useState} from "react"
import toast from "react-hot-toast"
import Link from "src/js/components/common/Link"
import {
  ButtonGroup,
  Content,
  Footer,
  ModalDialog,
  Title
} from "src/js/components/ModalDialog/ModalDialog"
import ThreeDotsIcon from "src/js/icons/ThreeDotsIcon"
import {showContextMenu} from "src/js/lib/System"
import styled from "styled-components"
import ToolbarButton from "./toolbar/button"

export default function SpaceMigration() {
  const [open, setOpen] = useState(true)
  if (open)
    return <ModalDialog onClosed={() => setOpen(false)}>{Modal}</ModalDialog>
  else return null
}

function Modal({onClose}) {
  function onCancelMigrate() {}

  function onMigrate() {
    onClose()
    toast.loading(
      (t) => {
        const onContextMenu = (e) => {
          const {x, y} = e.currentTarget.getBoundingClientRect()
          showContextMenu(
            [
              {
                label: "Cancel",
                click: () => {
                  onCancelMigrate()
                  toast.dismiss(t.id)
                }
              }
            ],
            {
              x: x - 50, // this will need to change as we add more items
              y: y - 35 // this too
            }
          )
        }
        return (
          <LoadingToast
            title="Migrating Spaces"
            message="1 of 12"
            onContextMenu={onContextMenu}
          />
        )
      },
      {duration: 99999 * 1000}
    )
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
