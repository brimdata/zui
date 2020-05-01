/* @flow */

/* INGEST AUTO REFRESH

If the tab history is empty, this component submits the current search. This
happens the first time this tab is rendered after a file is dragged in.

As the files are ingested the backend incrememnts a snapshot_counter to
indicate that more data is available to search.

Everytime space.ingest.snapshot is incremented, this component will effectively
hit the "Enter" key for the user if all these conditions are met:

* There is only 1 entry in the tab history
* The search bar inputs are in the same state as that first entry
* The current snapshot has not yet been acknowledged

If anyone of those is not true, then the component renders a message box to
allow the user to manually refresh if they want. This box appears when

* Any of the above conditions are not met
* The current snapshot has not yet been acknowledged

The snapshot is acknowledged when any of these events happen:
* A search is submitted
* The user presses the "x" button on the message box.
*/

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import History from "../state/History"
import InfoNotice from "./InfoNotice"
import Search from "../state/Search"
import Tab from "../state/Tab"
import brim from "../brim"
import submitSearch from "../flows/submitSearch"
import useThrottle from "./hooks/useThrottle"

export default function IngestRefresh() {
  let dispatch = useDispatch()
  let historyCount = useSelector(History.count)
  let firstSearch = useSelector(History.first)
  let nextSearch = useSelector(Search.getCurrentRecord)
  let space = useSelector(Tab.space)
  let snapshot = useThrottle(space.ingest.snapshot, 3000)
  let [snapshotAck, setSnapshotAck] = useState(snapshot)
  let ack = () => setSnapshotAck(snapshot)
  let autoRefresh =
    historyCount === 1 &&
    isEqual(firstSearch, nextSearch) &&
    snapshot !== snapshotAck

  useEffect(() => {
    ack()
    if (historyCount === 0) {
      dispatch(Search.setSpanArgs(brim.space(space).everythingSpan()))
      dispatch(submitSearch())
    }
  }, [historyCount])

  useEffect(() => {
    if (autoRefresh) {
      ack()
      dispatch(submitSearch(false))
    }
  }, [autoRefresh])

  if (!autoRefresh && snapshot !== snapshotAck) {
    return (
      <InfoNotice
        onClick={(buttonIndex) => {
          ack()
          if (buttonIndex === 0) dispatch(submitSearch(false))
        }}
      />
    )
  } else {
    return null
  }
}
