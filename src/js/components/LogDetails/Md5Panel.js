/* @flow */

import React from "react"

import type {PanelProps} from "./"
import type {RightClickBuilder} from "../../types"
import {correlationMenu} from "../../rightclick/correlationMenu"
import {
  filenameCorrelation,
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

  const {md5, tx, rx, filenames} = relatedLogs
  return (
    <div className="hash-correlation detail-panel">
      <PanelHeading status={statuses["Md5Search"]}>
        Md5 Correlation
      </PanelHeading>
      <AsyncTable
        logs={md5}
        rightClick={correlationMenu(md5Correlation(logMd5))}
        name="md5 count"
        status={statuses["Md5Search"]}
        expect={1}
      />
      <AsyncTable
        logs={filenames}
        rightClick={correlationMenu(filenameCorrelation(logMd5))}
        name="filename, mime_type count"
        status={statuses["Md5Search"]}
        expect={1}
      />
      <div className="two-column">
        <AsyncTable
          logs={tx}
          rightClick={correlationMenu(txHostsCorrelation(logMd5))}
          name="tx_hosts count"
          status={statuses["Md5Search"]}
          expect={5}
        />
        <AsyncTable
          logs={rx}
          rightClick={correlationMenu(rxHostsCorrelation(logMd5))}
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
