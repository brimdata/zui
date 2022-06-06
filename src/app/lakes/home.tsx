import React from "react"
import styled from "styled-components"
import BrimTextLogo from "src/js/components/BrimTextLogo"
import TabImport from "./import"

const BG = styled.div``

const Logo = styled(BrimTextLogo)`
  margin-top: 64px;
  margin-bottom: 24px;
`

export default function LakeHome() {
  return (
    <BG>
      <Logo />
      <TabImport />
    </BG>
  )
}
