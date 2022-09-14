import getPoolContextMenu from "src/app/pools/flows/get-pool-context-menu"
import {lakePoolPath} from "src/app/router/utils/paths"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import Icon from "src/app/core/icon-temp"
import {showContextMenu} from "src/js/lib/System"
import {MenuItemConstructorOptions} from "electron"
import {Pool} from "src/app/core/pools/pool"
import Ingests from "src/js/state/Ingests"
import Tabs from "src/js/state/Tabs"
import {Item} from "../item"

const PoolItem = ({styles, data, state, handlers}) => {
  const pool = data as Pool
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useSelector(Current.getLakeId)
  const ingest = useSelector(Ingests.get(pool.id))
  const ctxMenu: MenuItemConstructorOptions[] = [
    {
      label: "Rename",
      click: () => {
        handlers.edit()
      },
    },
    ...dispatch(getPoolContextMenu(pool)),
  ]

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handlers.select(e, {selectOnClick: true})
    dispatch(Tabs.previewUrl(lakePoolPath(pool.id, lakeId)))
  }

  const onDoubleClick = (e) => {
    e.preventDefault()
    dispatch(Tabs.activateUrl(lakePoolPath(pool.id, lakeId)))
  }

  return (
    <Item
      text={pool.name}
      icon={<Icon name="pool" />}
      state={state}
      style={styles.row}
      innerStyle={styles.indent}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
      onSubmit={handlers.submit}
      progress={ingest?.progress}
    />
  )
}

export default PoolItem
