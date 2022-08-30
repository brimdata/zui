import {formatDistanceToNowStrict} from "date-fns"
import React, {useMemo} from "react"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"
import styled from "styled-components"
import {Timeline} from "./timeline"
import {useEntryMenu} from "./use-entry-menu"
import {State} from "src/js/state/types"
import {ActiveQuery} from "src/app/core/models/active-query"

const Wrap = styled.div`
  height: 28px;
  padding: 0 10px;
  cursor: default;
`
const BG = styled.div`
  user-select: none;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 6px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.06);
  }
  &.deleted {
    cursor: not-allowed;
  }
`

const Text = styled.p`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 12px;
  flex: 1;
  .anonymous &,
  .modified &,
  .deleted & {
    opacity: 0.65;
    font-weight: 400;
  }
`

const Timestamp = styled.p`
  font-size: 10px;
  opacity: 0.4;
`

export type EntryType =
  | "outdated"
  | "latest"
  | "anonymous"
  | "deleted"
  | "modified"

function getColor(type: EntryType) {
  switch (type) {
    case "latest":
      return "var(--primary-color)"
    case "outdated":
      return "var(--yellow)"
    default:
      return "var(--border-color)"
  }
}

type Props = {
  version: string
  queryId: string
  index: number
}

function getType(active: ActiveQuery): EntryType {
  if (active.isDeleted()) return "deleted"
  if (active.isLatest()) return "latest"
  if (active.isOutdated()) return "outdated"
  if (active.isModified()) return "modified"
  return "anonymous"
}

function getValue(active: ActiveQuery) {
  if (active.isDeleted()) {
    return "(Deleted)"
  } else if (active.isAnonymous() || active.isModified()) {
    return active.value() || "(Empty)"
  } else {
    return active.name()
  }
}

function getTimestamp(active: ActiveQuery) {
  if (active.isDeleted()) return "-"
  const isoString = active.ts()
  try {
    let text = formatDistanceToNowStrict(new Date(isoString))
    if (/second/.test(text)) return "now"
    else return text.replace("second", "sec").replace("minute", "min")
  } catch (e) {
    console.error(e)
    return ""
  }
}

export function HistoryItem({version, queryId, index}: Props) {
  const api = useBrimApi()
  const onContextMenu = useEntryMenu(index)
  const sessionId = useSelector(Current.getSessionId)
  const session = useSelector(Current.getSession)
  const build = useMemo(Queries.makeBuildSelector, [])
  const query = useSelector((state: State) => build(state, queryId))
  const sVersion = useSelector((state) =>
    QueryVersions.at(sessionId).find(state, version)
  )
  const qVersion = useSelector((state) =>
    QueryVersions.at(queryId).find(state, version)
  )
  const versionObj = sVersion || qVersion
  const active = new ActiveQuery(session, query, versionObj)
  const onClick = () => {
    if (active.isDeleted()) return
    api.queries.open(active.id(), {version: active.versionId(), history: false})
  }
  const type = getType(active)
  const color = getColor(type)
  const value = getValue(active)
  const timestamp = getTimestamp(active)

  return (
    <Wrap onClick={onClick} onContextMenu={onContextMenu}>
      <BG className={type}>
        <Timeline color={color} />
        <Text>{value}</Text>
        <Timestamp>{timestamp}</Timestamp>
      </BG>
    </Wrap>
  )
}
