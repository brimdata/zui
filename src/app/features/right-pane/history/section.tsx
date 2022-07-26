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

export function HistorySection() {
  const dispatch = useDispatch()
  const sessionHistory = useSelector(Current.getSessionHistory)
  const allVersions = useSelector(QueryVersions.raw)
  const tabId = useSelector(Current.getTabId)
  const api = useBrimApi()

  // TODO: Session Flow - refactor this
  const historyToEntries = (sessHistory) => {
    return sessHistory
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
        } catch (e) {
          console.log(e)
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

  const entries = historyToEntries(sessionHistory)

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
