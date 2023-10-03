import React from "react"
import styled from "styled-components"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {Heading} from "./heading"
import {TitleBarProvider} from "./context"

const BG = styled.header.attrs({
  className: "title-bar",
  "aria-label": "Title Bar",
  "data-testid": "title-bar",
})`
  flex-shrink: 0;
  height: 37px;
  display: flex;
  align-items: center;
`

export function TitleBar() {
  const active = useSelector(Current.getActiveQuery)
  return (
    <BG>
      <TitleBarProvider activeQuery={active}>
        <Heading />
      </TitleBarProvider>
    </BG>
  )
}
