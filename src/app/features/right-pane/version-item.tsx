import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {formatDistanceToNowStrict} from "date-fns"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {NodeRendererProps} from "react-arborist"

const TimeNode = styled.div`
  display: flex;
  align-items: center;
`
const Version = styled.div`
  margin-right: 8px;
  opacity: 0.5;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
`
const Dot = styled.div`
  position: relative;
  height: 100%;
  height: 5px;
  width: 5px;
  margin: 0 16px;

  &:after {
    content: "";
    background-color: var(--primary-color);
    height: 5px;
    width: 5px;
    border-radius: 50%;
    position: absolute;
  }
`

const Container = styled.div`
  height: 28px;
  width: 100%;
  cursor: default;
  user-select: none;
  outline: none;
  white-space: nowrap;
  padding: 0 10px;

  &:not(:last-child) {
    ${Dot}:before {
      content: "";
      position: absolute;
      left: 2px;
      top: 16px;
      margin-top: 7px;
      border-left: 1px solid var(--hawkes-blue);
      height: 14px;
      width: 1px;
    }
  }
`

const BG = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-radius: 6px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &[aria-selected="true"] {
    border-radius: 6px;
    outline: none;
    background-color: var(--primary-color);
    color: white;
    ${Dot}:after {
      background-color: white;
    }
    &:hover {
      background-color: var(--primary-color);
    }
  }
`

const useForcedRenderInterval = (interval = 60000) => {
  const [renderTrigger, setRenderTrigger] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setRenderTrigger(!renderTrigger), interval)
    return () => clearTimeout(id)
  }, [renderTrigger])
}

export const FormattedTime = ({ts}: {ts: string}) => {
  useForcedRenderInterval()

  const duration = formatDistanceToNowStrict(new Date(ts))
  if (/second/.test(duration)) return <span>Just now</span>
  return <span>{duration} ago</span>
}

const VersionItem = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<QueryVersion & {id: string}>) => {
  return (
    <Container>
      <BG ref={dragHandle} aria-selected={node.isSelected} style={style}>
        <TimeNode>
          <Dot />
          <FormattedTime ts={node.data.ts} />
        </TimeNode>
        <Version>{node.data.value}</Version>
      </BG>
    </Container>
  )
}

export default VersionItem
