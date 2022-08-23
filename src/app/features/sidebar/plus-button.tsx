import React, {ChangeEvent} from "react"
import styled from "styled-components"

import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {useBrimApi} from "src/app/core/context"
import {MenuItemConstructorOptions} from "electron"
import {showContextMenu} from "src/js/lib/System"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import Modal from "src/js/state/Modal"
import {lakeImportPath} from "src/app/router/utils/paths"
import Tabs from "src/js/state/Tabs"
import Icon from "src/app/core/icon-temp"

export const Button = styled.button`
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
  const api = useBrimApi()
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
    const template: MenuItemConstructorOptions[] = [
      {
        label: "New Query Session",
        click: () => dispatch(Tabs.createQuerySession()),
      },
      {
        label: "New Pool",
        click: () => dispatch(Tabs.create(lakeImportPath(lakeId))),
        enabled: !!lakeId,
      },
      {type: "separator"},
      {
        label: "Add Lake...",
        click: () => dispatch(Modal.show("new-lake")),
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
      <Button aria-label="create" onClick={() => onClick()}>
        <Icon name="plus" size={18} fill="white" />
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
