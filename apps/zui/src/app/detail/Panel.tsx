import React, {memo, ReactNode} from "react"
import InlineTableLoading from "src/js/components/InlineTableLoading"
import {ChartWrap} from "./Shared"
import styled from "styled-components"

type Props = {
  isLoading?: boolean
  children: ReactNode
}

const BG = styled.div`
  background: var(--bg-color);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 0.5rem 1rem;
`

export default memo<Props>(function Panel({isLoading, children}: Props) {
  return (
    <BG>
      {isLoading ? (
        <ChartWrap>
          <InlineTableLoading rows={3} />
        </ChartWrap>
      ) : (
        children
      )}
    </BG>
  )
})
