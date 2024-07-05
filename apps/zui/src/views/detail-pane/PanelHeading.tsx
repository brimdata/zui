import React, {ReactNode} from "react"
import LoadingBurst from "src/js/components/LoadingBurst"
import styled from "styled-components"

const BG = styled.div`
  display: flex;
  user-select: none;

  .burst-1,
  .burst-2 {
    background-color: var(--chrome-color);
  }
`

type Props = {children: ReactNode; isLoading?: boolean}

export default function PanelHeading({children, isLoading}: Props) {
  return (
    <BG className="flow">
      <label>{children}</label>
      <LoadingBurst show={isLoading} />
    </BG>
  )
}
