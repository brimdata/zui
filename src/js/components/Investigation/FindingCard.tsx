import {useDispatch} from "react-redux"
import React from "react"
import classNames from "classnames"
import styled from "styled-components"

import {Finding} from "../../state/Investigation/types"
import {globalDispatch} from "../../state/GlobalContext"
import {submitSearch} from "../../flows/submitSearch/mod"
import FindingProgram from "./FindingProgram"
import Investigation from "../../state/Investigation"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import Search from "../../state/Search"
import usePopupMenu from "../hooks/usePopupMenu"
import {remote} from "electron"

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
    fill: ${(props) => props.theme.colors.lead};
    min-width: 13px;
    width: 13px;
    min-height: 13px;
    height: 13px;
  }
`

type Props = {finding: Finding; connId: string; spaceId: string}

export default React.memo<Props>(function FindingCard({
  finding,
  connId,
  spaceId
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
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete History Entry",
            message: `Are you sure you want to delete this history entry?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              globalDispatch(
                Investigation.deleteFindingByTs(connId, spaceId, finding.ts)
              )
          })
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this space?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              globalDispatch(
                Investigation.clearSpaceInvestigation(connId, spaceId)
              )
          })
    }
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
