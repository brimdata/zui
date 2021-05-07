import React from "react"
import styled from "styled-components"

const Frame = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
`

export default function VersionUpdate() {
  return (
    <div>
      <Frame src="/Users/jkerr/work/brim/app/welcome/version-25.html"></Frame>
    </div>
  )
}
