import React, {useMemo} from "react"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {useSelector} from "react-redux"
import {HistoryItem} from "./history-item"

const BG = styled.div`
  padding: 6px 0;
  overflow-y: auto;
`

export function HistorySection() {
  const sessionHistory = useSelector(Current.getSessionHistory) || []
  const history = useMemo(() => [...sessionHistory].reverse(), [sessionHistory])

  return (
    <BG aria-label="history-pane">
      {history.map(({version, queryId}, index) => (
        <HistoryItem
          key={index}
          index={sessionHistory.length - 1 - index} // since we reversed it
          queryId={queryId}
          version={version}
        />
      ))}
    </BG>
  )
}
