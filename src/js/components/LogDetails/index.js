/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "./Md5Panel"
import type {Search} from "../../state/searches/types"
import {buildLogDetail, getIsGoingBack} from "../../state/selectors/logDetails"
import {getLogDetailSearches} from "../../state/searches/selector"
import ConnPanel from "./ConnPanel"
import FieldsPanel from "./FieldsPanel"
import Log from "../../models/Log"
import NavAnimation from "./NavAnimation"
import NoSelection from "./NoSelection"
import UidPanel from "./UidPanel"

export type PanelProps = {|
  searches: Search[],
  log: Log
|}

export default function LogDetails() {
  let log = useSelector(buildLogDetail)
  let isGoingBack = useSelector(getIsGoingBack)
  let searches = useSelector(getLogDetailSearches)
  let panelProps = {log, searches}

  if (!log) return <NoSelection />

  return (
    <NavAnimation log={log} prev={isGoingBack}>
      <div className="log-detail">
        <FieldsPanel {...panelProps} />
        <UidPanel {...panelProps} />
        <ConnPanel {...panelProps} />
        <Md5Panel {...panelProps} />
      </div>
    </NavAnimation>
  )
}
