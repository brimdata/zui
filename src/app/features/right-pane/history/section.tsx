import React from "react"
import styled from "styled-components"
import {EntryType, HistoryEntry} from "./entry"
import Current from "src/js/state/Current"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {getQuerySource} from "../../../../js/state/Queries/flows/get-query-source"
import getQueryById from "../../../query-home/flows/get-query-by-id"
import QueryVersions from "src/js/state/QueryVersions"
import {formatDistanceToNowStrict} from "date-fns"
import {useBrimApi} from "src/app/core/context"

const BG = styled.div`
  padding: 6px 0;
`

const useSessionEntries = () => {
  const dispatch = useDispatch()
  const allVersions = useSelector(QueryVersions.raw)
  const tabId = useSelector(Current.getTabId)
  const sessionHistory = useSelector(Current.getSessionHistory)
  const api = useBrimApi()

  return sessionHistory
    ?.map(({queryId, version}, i) => {
      const q = dispatch(getQueryById(queryId))
      // if version does not match queryId saved in entry, it must be in session
      let qType = dispatch(getQuerySource(queryId))
      let entryVersion = allVersions[queryId]?.entities[version]
      if (!entryVersion) {
        entryVersion = allVersions[tabId]?.entities[version] || {}
        qType = "session"
      }

      const text = qType === "session" ? entryVersion?.value : q.name
      let type = "anonymous"
      if (qType !== "session") {
        if (version === q.latestVersionId()) type = "latest"
        else type = "outdated"
      }

      let timestamp = ""
      try {
        timestamp = formatDistanceToNowStrict(new Date(entryVersion?.ts))
        if (/second/.test(timestamp)) timestamp = "Just now"
      } catch (e) {
        console.error(e)
      }

      return {
        text,
        timestamp,
        type: type as EntryType,
        onClick: () => api.queries.open(queryId, {version, history: false}),
        key: `${i}-${version}`,
      }
    })
    .reverse()
}

export function HistorySection() {
  const entries = useSessionEntries()

  return (
    <BG>
      {entries?.map(({text, timestamp, type, onClick, key}) => (
        <HistoryEntry
          key={key}
          text={text || "(empty search)"}
          timestamp={timestamp}
          type={type}
          onClick={onClick}
        />
      ))}
    </BG>
  )
}
