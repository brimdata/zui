import React from "react"
import classNames from "classnames"
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import Warning from "src/app/core/icons/warning"
import Current from "src/js/state/Current"
import Loads from "src/js/state/Loads"
import Modal from "src/js/state/Modal"
import Pools from "src/js/state/Pools"
import ProgressIndicator from "../ProgressIndicator"

export function IngestProgress() {
  const dispatch = useDispatch()
  const lakeId = useSelector(Current.getLakeId)
  const poolId = useSelector(Current.getPoolId)
  const progress = useSelector((s) => Loads.getPoolProgress(s, poolId))
  const warnings = useSelector(Pools.getWarnings(lakeId, poolId))

  if (progress === null && !warnings) return null

  function onWarningsClick() {
    dispatch(Modal.show("ingest-warnings"))
  }

  return (
    <div className="packet-post-progress">
      <div className="group">
        <ProgressIndicator percent={progress} />
        {progress === null && warnings && (
          <label>Ingest failed with warnings.</label>
        )}
        <div
          className={classNames("warnings", {
            disabled: isEmpty(warnings),
          })}
          onClick={onWarningsClick}
        >
          <Warning />
          <label>{warnings?.length}</label>
        </div>
      </div>
    </div>
  )
}
