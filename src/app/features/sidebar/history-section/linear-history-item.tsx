import React from "react"
import * as remote from "@electron/remote"
import {MenuItemConstructorOptions} from "electron"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Icon from "src/app/core/icon-temp"
import submitSearch from "src/app/query-home/flows/submit-search"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Investigation from "src/js/state/Investigation"
import Search from "src/js/state/Search"
import styled from "styled-components"
import {Item} from "../item"

const HistoryIcon = styled(Icon).attrs({name: "query"})``

const LinearHistoryItem = ({styles, data: historyItem}) => {
  const dispatch = useDispatch()
  const lakeId = useSelector(Current.getLakeId)
  const poolId = useSelector(Current.getPoolId)

  function onClick() {
    dispatch(Search.restore(historyItem.search))
    dispatch(submitSearch({history: false, version: false}))
  }

  const ctxMenu: MenuItemConstructorOptions[] = [
    {
      label: "Delete",
      click: () =>
        dispatch(
          Investigation.deleteFindingByTs(lakeId, poolId, historyItem.ts)
        ),
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this pool?`,
            buttons: ["OK", "Cancel"],
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(Investigation.clearPoolInvestigation(lakeId, poolId))
          }),
    },
  ]

  return (
    <Item
      styles={styles}
      text={historyItem.search.program}
      icon={<HistoryIcon />}
      onClick={onClick}
      onContextMenu={() => showContextMenu(ctxMenu)}
    />
  )
}

export default LinearHistoryItem
