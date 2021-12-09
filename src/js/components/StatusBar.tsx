import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {ingestProgressBar} from "../../../test/playwright/helpers/locators"
import {isNumber} from "../lib/is"
import {reactElementProps} from "../../../test/playwright/helpers/integration"
import Current from "../state/Current"
import Modal from "../state/Modal"
import ProgressIndicator from "./ProgressIndicator"
import Pools from "../state/Pools"
import Warning from "./icons/warning-sm.svg"
import brim from "../brim"

export default function StatusBar() {
  const dispatch = useDispatch()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const poolId = useSelector(Current.getPoolId)
  const pool = useSelector(Current.getPool)
  const value = useSelector(Pools.getIngestProgress(workspaceId, poolId))
  const warnings = useSelector(Pools.getIngestWarnings(workspaceId, poolId))
  if (!isNumber(value) && isEmpty(warnings)) return null
  const s = brim.pool(pool)

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
          {s.ingesting() && (
            <ProgressIndicator {...ingestProgressBar.props} percent={value} />
          )}
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
