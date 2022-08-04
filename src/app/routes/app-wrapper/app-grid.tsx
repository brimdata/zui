import React from "react"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"

type Props = {
  areas: string
  rows: string
  columns: string
}

const BG = styled.div<Props>`
  min-height: 0;
  height: 100vh;
  display: grid;
  grid-template-areas: ${(p) => p.areas};
  grid-template-rows: ${(p) => p.rows};
  grid-template-columns: ${(p) => p.columns};
`

export function AppGrid({children}) {
  const sidebarIsOpen = useSelector(Appearance.sidebarIsOpen)
  const sidebarWidth = useSelector(Appearance.sidebarWidth)
  const areas = `
    "sidebar tabs"
    "sidebar main"
    "sidebar status"
  `
  const width = sidebarIsOpen ? sidebarWidth : 0
  const rows = ["42px", "1fr", "28px"]
  const columns = [width + "px", "1fr"]

  return (
    <BG areas={areas} rows={rows.join(" ")} columns={columns.join(" ")}>
      {children}
    </BG>
  )
}
