import React from "react"
import styled from "styled-components"
import {Timeline} from "./timeline"
import {formatDistanceToNowStrict} from "date-fns"

const Wrap = styled.div`
  height: 28px;
  padding: 0 10px;
  cursor: default;
`
const BG = styled.div`
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 6px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`

const Text = styled.p`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 12px;
  flex: 1;
  .anonymous & {
    opacity: 0.65;
    font-weight: 400;
  }
`

const Timestamp = styled.p`
  font-size: 10px;
  opacity: 0.4;
`

export type EntryType = "outdated" | "latest" | "anonymous"
type Props = {
  text: string
  timestamp: string
  type: EntryType
  onClick: () => void
}

function getColor(props: Props) {
  switch (props.type) {
    case "anonymous":
      return "var(--border-color)"
    case "latest":
      return "var(--primary-color)"
    case "outdated":
      return "var(--yellow)"
  }
}

export function HistoryEntry(props: Props) {
  return (
    <Wrap onClick={props.onClick}>
      <BG className={props.type}>
        <Timeline color={getColor(props)} />
        <Text>{props.text}</Text>
        <Timestamp>{props.timestamp}</Timestamp>
      </BG>
    </Wrap>
  )
}
