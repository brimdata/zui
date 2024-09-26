import React, {ChangeEvent} from "react"
import styled from "styled-components"

import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {useZuiApi} from "src/views/application/context"
import {MenuItem, showContextMenu} from "src/core/menu"
import {useDispatch} from "src/core/use-dispatch"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {Icon} from "src/components/icon"
import {connectToLake} from "src/app/commands/connect-to-lake"
import Modal from "src/js/state/Modal"
import {QuerySession} from "src/models/query-session"

export const Button = styled.button`
  color: white;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border-width: 0;
  margin-right: 10px;

  &:hover {
    background-color: var(--primary-color-dark);
  }
  &:active {
    background-color: var(--primary-color-darker);
  }
`

export default function PlusButton() {
  const api = useZuiApi()
  const dispatch = useDispatch()
  const lakeId = useLakeId()
  const [importer, ref] = useCallbackRef<HTMLInputElement>()

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      api.queries.import(file)
    }
    e.target.value = null
  }

  const onClick = () => {
    const template: MenuItem[] = [
      {
        label: "New Query Session",
        click: () => QuerySession.createWithTab(),
      },
      {
        label: "New Pool",
        click: () => dispatch(Modal.show("new-pool")),
        enabled: !!lakeId,
      },
      {type: "separator"},
      {
        label: "Add Lake...",
        click: () => connectToLake.run(),
      },
      {
        label: "Import Queries...",
        click: () => importer && importer.click(),
      },
    ]

    showContextMenu(template)
  }
  return (
    <>
      <Button aria-label="create" onMouseDown={() => onClick()}>
        <Icon name="plus" />
      </Button>
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onImport}
      />
    </>
  )
}
