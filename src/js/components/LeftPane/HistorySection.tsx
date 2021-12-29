import {useDispatch, useSelector} from "react-redux"
import Layout from "../../state/Layout"
import React from "react"
import InvestigationLinear from "../Investigation/InvestigationLinear"
import FilterTree from "../FilterTree"
import {
  ClickRegion,
  DragAnchor,
  SectionContents,
  SectionHeader,
  StyledArrow,
  StyledSection,
  StyledViewSelect,
  Title
} from "./common"
import usePopupMenu from "../hooks/usePopupMenu"
import {capitalize} from "lodash"
import DropdownArrow from "../../icons/DropdownArrow"

function InvestigationView({view}) {
  switch (view) {
    case "tree":
      return <InvestigationTree />
    case "linear":
      return <InvestigationLinear />
    default:
      return null
  }
}

function InvestigationTree() {
  return <FilterTree />
}

const ViewSelect = () => {
  const dispatch = useDispatch()
  const currentView = useSelector(Layout.getHistoryView)

  const menu = usePopupMenu([
    {
      label: "Linear",
      click: () => dispatch(Layout.setHistoryView("linear"))
    },
    {
      label: "Tree",
      click: () => dispatch(Layout.setHistoryView("tree"))
    }
  ])

  return (
    <StyledViewSelect onClick={menu.onClick}>
      {capitalize(currentView)}
      <DropdownArrow />
    </StyledViewSelect>
  )
}

function HistorySection({isOpen, style, resizeProps, toggleProps}) {
  const view = useSelector(Layout.getHistoryView)
  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>History</Title>
        </ClickRegion>
        <ViewSelect />
      </SectionHeader>
      <SectionContents>
        <InvestigationView view={view} />
      </SectionContents>
    </StyledSection>
  )
}

export default HistorySection
