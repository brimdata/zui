/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import InfoNotice from "./InfoNotice"
import Search from "../state/Search"
import Tab from "../state/Tab"
import brim from "../brim"
import submitSearch from "../flows/submitSearch"

export default function IngestRefresh() {
  let dispatch = useDispatch()
  let firstVisit = !useSelector(Tab.currentEntry)
  let space = useSelector(Tab.space)
  let [ack, setAck] = useState(space.ingest.snapshot)

  useEffect(() => {
    if (firstVisit) {
      dispatch(Search.setSpanArgs(brim.space(space).everythingSpan()))
      dispatch(submitSearch())
    }
  }, [firstVisit])

  function onClick(index) {
    setAck(space.ingest.snapshot)
    if (index === 0) dispatch(submitSearch())
  }

  if (ack === space.ingest.snapshot) {
    return null
  } else {
    return <InfoNotice onClick={onClick} />
  }
}
