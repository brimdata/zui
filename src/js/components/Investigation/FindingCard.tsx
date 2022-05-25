import React from "react"
import classNames from "classnames"
import styled from "styled-components"
import {Finding} from "../../state/Investigation/types"
import submitSearch from "src/app/query-home/flows/submit-search"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import Search from "../../state/Search"
import usePopupMenu from "../hooks/usePopupMenu"
import * as remote from "@electron/remote"
import {useDispatch} from "src/app/core/state"

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
  fill: var(--lead);
  min-width: 13px;
  width: 13px;
  min-height: 13px;
  height: 13px;
`

type Props = {finding: Finding; lakeId: string; poolId: string}

export default React.memo<Props>(function FindingCard({
  finding,
  lakeId,
  poolId,
}: Props) {
  const dispatch = useDispatch()

  function onClick() {
    dispatch(Search.restore(finding.search))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const menu = usePopupMenu([
    {
      label: "Delete",
      click: () =>
        dispatch(Investigation.deleteFindingByTs(lakeId, poolId, finding.ts)),
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
  ])

  return (
    <div
      className={classNames("finding-card-wrapper")}
      onClick={onClick}
      onContextMenu={() => menu.open()}
    >
      <div className="finding-card">
        <StyledMagnifyingGlass />
        <FindingProgram search={finding.search} />
      </div>
    </div>
  )
})
