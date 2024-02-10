import React, {ComponentType} from "react"
import styled from "styled-components"

const EmptyWrapper = styled.div`
  display: flex;
  min-width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 26px 0;
  user-select: none;

  p {
    color: var(--fg-color-less);
    text-align: center;
    margin: 16px 14px 0;
    text-wrap: pretty;
  }
` as ComponentType<React.PropsWithChildren<any>>

type EmptySectionProps = {
  icon?: any
  message: string
}

const EmptySection = ({message}: EmptySectionProps) => {
  return (
    <EmptyWrapper>
      <p>{message}</p>
    </EmptyWrapper>
  )
}

export default EmptySection
