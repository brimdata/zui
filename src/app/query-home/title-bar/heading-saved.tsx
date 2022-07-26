import classNames from "classnames"
import {MenuItemConstructorOptions} from "electron"
import React, {useRef} from "react"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Layout from "src/js/state/Layout"
import Queries from "src/js/state/Queries"
import styled from "styled-components"
import popupPosition from "../search-area/popup-position"
import getQueryListMenu from "../toolbar/flows/get-query-list-menu"
import {ActiveQuery} from "./active-query"
import {HeadingButton} from "./heading-button"

const Title = styled.h2`
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.modified {
    font-style: italic;
  }
`

const Tag = styled.div`
  font-size: 10px;
  line-height: 10px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  font-weight: 700;
  text-transform: uppercase;
  background: #ffe5cb;
  color: #8a4500;
  border-radius: 3px;
`

const Dropdown = styled(Icon).attrs({name: "chevron-down", size: 16})``

export function HeadingSaved({active}: {active: ActiveQuery}) {
  const dispatch = useDispatch()
  const api = useBrimApi()
  const ref = useRef<HTMLButtonElement>()
  const anyQueries = useSelector(Queries.any)
  const onClick = () => {
    const savedQueries = dispatch(getQueryListMenu())
    const editOptions = [
      {
        label: "Rename",
        click: () => {
          dispatch(Layout.showTitleForm("update"))
        },
      },
      {
        label: "Go to Latest Version",
        click: () => api.queries.open(active.query.id),
        visible: active.isOutdated(),
      },
    ] as MenuItemConstructorOptions[]
    const menu = [
      ...editOptions,
      {type: "separator"},
      {label: "Switch Query", submenu: savedQueries},
    ] as MenuItemConstructorOptions[]
    showContextMenu(menu, popupPosition(ref.current))
  }

  if (!anyQueries) return

  return (
    <HeadingButton onClick={onClick} ref={ref}>
      <Title className={classNames({modified: active.isModified()})}>
        {active.name()}
      </Title>
      {active.isOutdated() && <Tag>Outdated</Tag>}
      <Dropdown />
    </HeadingButton>
  )
}
