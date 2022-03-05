import React, {ChangeEvent} from "React"
import styled from "styled-components"

import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {useBrimApi} from "src/app/core/context"
import {MenuItemConstructorOptions} from "electron"
import {showContextMenu} from "src/js/lib/System"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import Modal from "src/js/state/Modal"
import {lakeImportPath, lakeQueryPath} from "src/app/router/utils/paths"
import Tabs from "src/js/state/Tabs"
import {newQuery} from "src/app/query-home/flows/new-query"

const Button = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  border-width: 0;
  margin: 0 16px;
  line-height: 20px;
  font-family: "system-ui", sans-serif;
  font-weight: 300;
  font-size: 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
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
      api.importQueries(file)
    }
    e.target.value = null
  }

  const onClick = () => {
    const template: MenuItemConstructorOptions[] = [
      {
        label: "New Query",
        click: () => {
          const query = dispatch(newQuery())
          dispatch(Tabs.new(lakeQueryPath(query.id, lakeId, {isDraft: true})))
        }
      },
      {
        label: "New Pool",
        click: () => dispatch(Tabs.new(lakeImportPath(lakeId))),
        enabled: !!lakeId
      },
      {type: "separator"},
      {
        label: "Add Lake...",
        click: () => dispatch(Modal.show("new-lake"))
      },
      {
        label: "Import Queries...",
        click: () => importer && importer.click()
      }
    ]

    showContextMenu(template)
  }
  return (
    <>
      <Button onClick={() => onClick()}>+</Button>
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onImport}
      />
    </>
  )
}
