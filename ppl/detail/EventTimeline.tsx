import useContentRect from "app/core/hooks/useContentRect"
import {scaleTime, extent} from "d3"
import React, {memo, useState} from "react"
import styled from "styled-components"
import {BrimEventInterface} from "./models/BrimEvent"
import EventTag from "./EventTag"
import brim from "src/js/brim"
import BrimTooltip from "src/js/components/BrimTooltip"
import {useDispatch} from "react-redux"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import {cssVar, darken} from "polished"
import useResizeCallback from "app/core/hooks/useResizeCallback"

const Lane = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 18px;
  margin-bottom: 3px;
  &:last-of-type {
    margin-bottom: 0px;
  }

  &:hover {
    time {
      display: block;
    }
  }
`

const Axis = styled.div`
  height: 1px;
  background: none;
  box-shadow: 0 0.5px 0 var(--cloudy);
  width: 100%;
`

const Layer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`

const Tag = styled(EventTag)`
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &:active {
    box-shadow: none;
  }

  &.current {
    box-shadow: 0 0 0 1px var(--azure),
      0 0 2px 1px ${darken(0.1, cssVar("--havelock") as string)};
  }
`

type Props = {
  events: BrimEventInterface[]
  current?: number
}

export default memo(function EventTimeline({events, current}: Props) {
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const [lastItem, lastItemRef] = useContentRect()
  const resizeRef = useResizeCallback(({width}) => setWidth(width))
  const scale = scaleTime()
    .domain(extent(events.flatMap((e) => [e.getTime(), e.getEndTime()])))
    .range([0, width - lastItem.width])

  const getX = (e) => {
    const start = events.length === 1 ? 0 : scale(e.getTime())
    return {transform: `translateX(${start}px)`}
  }

  const getWidth = (e) => {
    if (e.getEndTime && e.getEndTime()) {
      const start = scale(e.getTime())
      const end = scale(e.getEndTime())
      return {width: end - start}
    } else {
      return undefined
    }
  }

  const onClick = (event: BrimEventInterface) => {
    dispatch(viewLogDetail(event.getRecord()))
  }

  const getRef = (i) =>
    i === events.length - 1 && events.length > 1 ? lastItemRef : undefined

  return (
    <div ref={resizeRef}>
      {events.map((e, i) => (
        <Lane key={i}>
          <Layer>
            <Axis />
          </Layer>
          <Layer>
            <div
              ref={getRef(i)}
              onClick={() => onClick(e)}
              data-tip={brim.time(e.getTime()).format()}
              data-for="event-timeline"
              data-place="left"
              data-effect="solid"
              data-delay-show={0}
              style={{...getX(e)}}
            >
              <Tag
                event={e}
                style={getWidth(e)}
                className={current === i ? "current" : undefined}
              />
            </div>
          </Layer>
        </Lane>
      ))}
      <BrimTooltip id="event-timeline" />
    </div>
  )
})
