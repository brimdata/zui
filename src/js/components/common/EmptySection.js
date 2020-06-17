/* @flow */
import React, {type Node} from "react"

import styled from "styled-components"

const EmptyWrapper = styled.div`
  display: flex;
  min-width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 26px 0;

  svg {
    fill: ${(props) => props.theme.colors.cloudy};
    stroke: ${(props) => props.theme.colors.cloudy};
  }

  p {
    ${(props) => props.theme.typography.labelSmall};
    color: ${(props) => props.theme.colors.slate};
    text-align: center;
    margin: 16px 14px 0;
  }
`

type EmptySectionProps = {
  icon: Node,
  message: string
}

const EmptySection = ({icon, message}: EmptySectionProps) => {
  return (
    <EmptyWrapper>
      {icon}
      <p>{message}</p>
    </EmptyWrapper>
  )
}

export default EmptySection
