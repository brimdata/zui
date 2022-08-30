import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {formatDistanceToNowStrict} from "date-fns"
import {useSelector} from "react-redux"
import Current from "../../../js/state/Current"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {useBrimApi} from "src/app/core/context"

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
  margin: 0 18px;
  padding-bottom: 2.5em;

  &:after {
    content: "";
    background-color: var(--primary-color);
    height: 5px;
    width: 5px;
    border-radius: 50%;
    position: absolute;
    top: 13px;
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
    background: var(--sidebar-item-hover);
  }

  &:active {
    background: var(--sidebar-item-active);
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

const VersionItem = ({styles, data, handlers}) => {
  const queryVersion = data as QueryVersion
  const query = useSelector(Current.getNamedQuery)
  const api = useBrimApi()

  const onClick = (e) => {
    e.preventDefault()
    handlers.select(e, {selectOnClick: true})
    api.queries.open(query.id, {version: queryVersion.version})
  }

  return (
    <Container tabIndex={0} style={styles.row}>
      <BG
        aria-selected={query.current?.version === queryVersion.version}
        style={styles.indent}
        onClick={onClick}
      >
        <TimeNode>
          <Dot />
          <FormattedTime ts={queryVersion.ts} />
        </TimeNode>
        <Version onClick={onClick}>{queryVersion.value}</Version>
      </BG>
    </Container>
  )
}

export default VersionItem
