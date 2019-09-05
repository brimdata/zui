/* @flow */
import {useDispatch} from "react-redux"
import React, {useEffect, useState} from "react"

import {getCurrentSpaceName} from "../../state/reducers/spaces"
import {withCommas} from "../../lib/fmt"
import CheckCircle from "../CheckCircle"
import ErrorFactory from "../../models/ErrorFactory"
import LoadingDots from "../LoadingDots"
import XCircle from "../XCircle"

type Props = {path: string}

export default function IngestFile({path}: Props) {
  let [status, setStatus] = useState("ingesting")
  let [message, setMessage] = useState("Ingesting...")
  let dispatch = useDispatch()

  function onSuccess(info) {
    setStatus("success")
    let success = info.events_written
    let failed = [
      "events_bad_format",
      "events_bad_meta_data",
      "events_line_too_long",
      "events_rejected",
      "events_write_failure"
    ].reduce((sum, name) => (sum += info[name]), 0)
    setMessage(
      `Events Ingested: ${withCommas(success)}; Events Failed: ${withCommas(
        failed
      )}`
    )
  }

  function onError(e) {
    setStatus("error")
    setMessage(ErrorFactory.create(e).message())
  }

  useEffect(() => {
    dispatch((dispatch, getState, boom) => {
      let space = getCurrentSpaceName(getState())
      boom
        .ingest(space, path)
        .done(onSuccess)
        .error(onError)
    })
  }, [])

  function renderStatus(s) {
    switch (s) {
      case "success":
        return <CheckCircle />
      case "error":
        return <XCircle />
      default:
        return <LoadingDots />
    }
  }

  return (
    <li>
      <span className="status">{renderStatus(status)}</span>
      <span>
        {path}
        <span className={`message ${status}`}>{message}</span>
      </span>
    </li>
  )
}
