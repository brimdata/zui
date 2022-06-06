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
import {poolClick} from "../flows/pool-click"

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
    {
      label: "Get Info",
      click: () => {
        dispatch(Tabs.activateUrl(lakePoolPath(pool.id, lakeId)))
      },
    },
    ...dispatch(getPoolContextMenu(pool)),
  ]

  const onClick = (e) => {
    e.preventDefault()
    handlers.select(e, {selectOnClick: true})
    dispatch(poolClick(pool))
  }

  return (
    <Item
      text={pool.name}
      icon={<Icon name="pool" />}
      state={state}
      styles={styles}
      onClick={onClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
      onSubmit={handlers.submit}
      progress={ingest?.progress}
    />
  )
}

export default PoolItem
