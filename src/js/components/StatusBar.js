/* @flow */

import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {isNumber} from "../lib/is"
import {reactElementProps} from "../test/integration"
import Modal from "../state/Modal"
import ProgressIndicator from "./ProgressIndicator"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Warning from "./icons/warning-sm.svg"
import brim from "../brim"

export default function StatusBar() {
  let dispatch = useDispatch()
  let clusterID = useSelector(Tab.clusterId)
  let spaceID = useSelector(Tab.spaceID)
  let space = useSelector(Tab.space)
  let value = useSelector(Spaces.getIngestProgress(clusterID, spaceID))
  let warnings = useSelector(Spaces.getIngestWarnings(clusterID, spaceID))
  if (!isNumber(value) && isEmpty(warnings)) return null
  let s = brim.space(space)

  function onWarningsClick() {
    dispatch(Modal.show("ingest-warnings"))
  }

  function getMessage() {
    if (s.queryable() && s.ingesting()) {
      return "Partial data available while loading…"
    }
  }

  return (
    <div className="status-bar">
      <div
        className="packet-post-progress"
        {...reactElementProps("ingestProgress")}
      >
        <label>{getMessage()}</label>
        <div className="group">
          {s.ingesting() && <ProgressIndicator percent={value} />}
          {!s.ingesting() && s.empty() && (
            <label>Ingest failed with warnings.</label>
          )}
          <div
            className={classNames("warnings", {
              disabled: isEmpty(warnings) || !s.queryable()
            })}
            onClick={onWarningsClick}
          >
            <Warning />
            <label>{warnings.length}</label>
          </div>
        </div>
      </div>
    </div>
  )
}
