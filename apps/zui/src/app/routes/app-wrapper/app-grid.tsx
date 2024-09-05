import {useDrop} from "@react-aria/dnd"
import React, {useRef} from "react"
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
  const secondarySidebarIsOpen = useSelector(Appearance.secondarySidebarIsOpen)
  const secondarySidebarWidth = useSelector(Appearance.secondarySidebarWidth)

  const areas = `
    "sidebar tabs secondary-sidebar"
    "sidebar main secondary-sidebar"
  `
  const width = sidebarIsOpen ? sidebarWidth : 0
  const width2 = secondarySidebarIsOpen ? secondarySidebarWidth : 0
  const rows = ["40px", "1fr"]
  const columns = [`min(${width}px, 50vw)`, "1fr", `min(${width2}px, 50vw)`]
  const style = {
    gridTemplateAreas: areas,
    gridTemplateRows: rows.join(" "),
    gridTemplateColumns: columns.join(" "),
  }
  const ref = useRef()
  const {dropProps} = useDrop({ref})
  return (
    <BG style={style} {...dropProps} ref={ref}>
      {children}
    </BG>
  )
}
