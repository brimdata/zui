import React from "react"
import styled from "styled-components"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {NavActions} from "./nav-actions"
import {Heading} from "./heading"
import {QueryActions} from "./query-actions"
import {TitleBarProvider} from "./context"

const BG = styled.header.attrs({className: "title-bar"})`
  flex-shrink: 0;
  height: 37px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 10px;
`

export function TitleBar() {
  const active = useSelector(Current.getActiveQuery)
  return (
    <BG>
      <TitleBarProvider activeQuery={active}>
        <NavActions />
        <Heading />
        <QueryActions />
      </TitleBarProvider>
    </BG>
  )
}
