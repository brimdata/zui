import React from "react"
import styled from "styled-components"

import LogoType from "../icons/LogoType"

const BG = styled.div`
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  svg {
    display: block;
    margin: 0 auto;
  }
`

export default function BrimTextLogo(props) {
  return (
    <BG {...props}>
      <LogoType />
    </BG>
  )
}
