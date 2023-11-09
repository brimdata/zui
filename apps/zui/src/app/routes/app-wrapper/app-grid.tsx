import React from "react"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import styled from "styled-components"

const BG = styled.div`
  min-height: 0;
  height: 100vh;
  display: grid;

  body:not(.is-dragging) & {
    transition: grid-template-columns 300ms var(--pop-easing);
  }
`

export function AppGrid({children}) {
  const sidebarIsOpen = useSelector(Appearance.sidebarIsOpen)
  const sidebarWidth = useSelector(Appearance.sidebarWidth)
  const areas = `
    "sidebar tabs"
    "sidebar main"
  `
  const width = sidebarIsOpen ? sidebarWidth : 0
  const rows = ["40px", "1fr"]
  const columns = [`min(${width}px, 80vw)`, "1fr"]
  const style = {
    gridTemplateAreas: areas,
    gridTemplateRows: rows.join(" "),
    gridTemplateColumns: columns.join(" "),
  }

  return <BG style={style}>{children}</BG>
}
