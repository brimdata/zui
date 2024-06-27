import React, {ReactNode} from "react"
import LoadingBurst from "src/js/components/LoadingBurst"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  margin: 0 4px 12px 4px;
  user-select: none;

  h4 {
    margin: 0;
    font-weight: bold;
    font-size: 1rem;
    padding-left: 0.5rem;
  }

  .burst-1,
  .burst-2 {
    background-color: var(--chrome-color);
  }
`

type Props = {children: ReactNode; isLoading?: boolean}

export default function PanelHeading({children, isLoading}: Props) {
  return (
    <BG>
      <h4>{children}</h4>
      <LoadingBurst show={isLoading} />
    </BG>
  )
}
