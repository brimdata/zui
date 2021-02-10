import React from "react"
import styled, {keyframes} from "styled-components"

const loading = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

const BG = styled.div`
  animation: fadein 200ms;
  padding: 12px;
`

const Row = styled.div`
  height: 22px;
  width: 100%;
  border-radius: 1px;
  background: linear-gradient(
    to right,
    var(--table-stripe-bg) 10%,
    var(--hover-light-bg) 50%,
    var(--table-stripe-bg) 90%
  );
  animation: ${loading} 1s linear infinite;
  background-size: 1000px 22px;
  &:nth-child(even) {
    background: none;
  }
  position: relative;
`

export default function TableSkeleton() {
  return (
    <BG>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Row key={i} />
        ))}
    </BG>
  )
}
