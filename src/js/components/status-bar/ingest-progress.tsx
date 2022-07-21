import React from "react"
import classNames from "classnames"
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import Warning from "src/app/core/icons/warning"
import Current from "src/js/state/Current"
import Ingests from "src/js/state/Ingests"
import Modal from "src/js/state/Modal"
import ProgressIndicator from "../ProgressIndicator"

export function IngestProgress() {
  const dispatch = useDispatch()
  const poolId = useSelector(Current.getPoolId)
  const ingest = useSelector(Ingests.get(poolId))

  if (!ingest) return null

  function onWarningsClick() {
    dispatch(Modal.show("ingest-warnings"))
  }
  const {progress, warnings} = ingest

  return (
    <div className="packet-post-progress">
      <div className="group">
        <ProgressIndicator percent={progress} />
        {progress === 1 && warnings.length > 0 && (
          <label>Ingest failed with warnings.</label>
        )}
        <div
          className={classNames("warnings", {
            disabled: isEmpty(warnings),
          })}
          onClick={onWarningsClick}
        >
          <Warning />
          <label>{warnings.length}</label>
        </div>
      </div>
    </div>
  )
}
