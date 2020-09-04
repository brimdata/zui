/* @flow */
import {useSelector} from "react-redux"
import React from "react"
import styled from "styled-components"

import type {Styled} from "../types/styled"
import {formatBytes} from "../lib/bytes"
import Current from "../state/Current"
import SpaceIcon from "./SpaceIcon"
import brim from "../brim"

const Wrap: Styled<> = styled.div`
  min-width: 0;
  height: 42px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const TitleRow = styled(Row)`
  margin-bottom: 4px;
`

const StatsRow = styled(Row)``

const Title = styled.h2`
  ${(props) => props.theme.typography.labelBold}
  text-shadow: 0 1px rgba(255, 255, 255, 0.5);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const IconWrap = styled.div`
  margin-right: 6px;
  svg {
    height: 13px;
    width: 13px;
  }
`

const Stat = styled.span`
  ${(props) => props.theme.typography.headingList}
  color: var(--slate);
  margin-right: 12px;
  white-space: nowrap;
`

export default function SearchPageTitle() {
  const space = useSelector(Current.mustGetSpace)
  const {size, name, min_time, max_time} = space
  const bytes = formatBytes(size, 1)
  // $FlowFixMe
  const duration = brim.span([min_time, max_time]).shortFormat()

  return (
    <Wrap>
      <TitleRow>
        <IconWrap>{<SpaceIcon type={space.getType()} />}</IconWrap>
        <Title>{name}</Title>
      </TitleRow>
      <StatsRow>
        <Stat>{bytes}</Stat>
        <Stat>{duration}</Stat>
      </StatsRow>
    </Wrap>
  )
}
