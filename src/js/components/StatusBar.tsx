import classNames from "classnames"
import {isEmpty} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import Current from "../state/Current"
import Ingests from "../state/Ingests"
import Modal from "../state/Modal"
import Warning from "./icons/warning-sm"
import ProgressIndicator from "./ProgressIndicator"
import React from "react"

export default function StatusBar() {
  const dispatch = useDispatch()
  const poolId = useSelector(Current.getPoolId)
  const ingest = useSelector(Ingests.get(poolId))

  if (!ingest) return null
  const {progress, warnings} = ingest

  function onWarningsClick() {
    dispatch(Modal.show("ingest-warnings"))
  }

  return (
    <div className="status-bar">
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
    </div>
  )
}
