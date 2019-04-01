/* @flow */

import React from "react"

import type {Dispatch} from "../../reducers/types"
import type {PanelProps} from "./"
import type {RightClickBuilder} from "../../types"
import {
  changeSearchBarInput,
  clearSearchBar,
  submitSearchBar
} from "../../actions/searchBar"
import {deaggregate} from "../../lib/Program"
import {
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../models/searches/programs"
import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"

export const Md5Panel = ({log, statuses, relatedLogs}: PanelProps) => {
  const logMd5 = log.get("md5")
  if (!logMd5) return null

  function makeRightClickBuilder(origProgram) {
    return function(field, log) {
      return [
        {
          type: "action",
          text: "Pivot to logs",
          onClick: (dispatch: Dispatch) => {
            const program = deaggregate(origProgram, log)
            if (program) {
              dispatch(clearSearchBar())
              dispatch(changeSearchBarInput(program))
              dispatch(submitSearchBar())
            }
          }
        }
      ]
    }
  }

  const {md5, tx, rx} = relatedLogs
  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={statuses["Md5Search"]}>
        Md5 Correlation
      </PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={makeRightClickBuilder(md5Correlation(logMd5))}
        name="md5 count"
        status={statuses["Md5Search"]}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={makeRightClickBuilder(txHostsCorrelation(logMd5))}
          name="tx_hosts count"
          status={statuses["Md5Search"]}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={makeRightClickBuilder(rxHostsCorrelation(logMd5))}
          name="rx_hosts count"
          status={statuses["Md5Search"]}
          expect={5}
        />
      </div>
    </div>
  )
}

type Props = {
  logs: Log[],
  expect: number,
  name: string,
  rightClick?: RightClickBuilder
}

function AsyncTable({logs, expect, name, rightClick}: Props) {
  if (logs.length === 0) {
    return <InlineTableLoading title={`Loading ${name}...`} rows={expect} />
  } else {
    return (
      <HorizontalTable
        descriptor={logs[0].descriptor}
        logs={logs}
        rightClick={rightClick}
      />
    )
  }
}
