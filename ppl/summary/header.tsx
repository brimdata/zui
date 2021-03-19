import React from "react"
import styled from "styled-components"

type Props = {
  title: string
}

const BG = styled.header``

const Title = styled.h2`
  ${(p) => p.theme.typography.headingPage}
  margin: 24px 12px 12px 12px;
  text-align: center;
  user-select: none;
`

export default function Header({title}: Props) {
  return (
    <BG>
      <Title>{title}</Title>
    </BG>
  )
}
