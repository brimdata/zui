import {useDispatch, useSelector} from "react-redux"
import React, {MouseEvent, useRef} from "react"
import styled from "styled-components"

import {XLeftPaneExpander} from "./LeftPaneExpander"
import AddSpaceButton from "./AddSpaceButton"
import ClusterPicker from "./ClusterPicker"
import Current from "../state/Current"
import DropdownArrow from "../icons/DropdownArrow"
import FilterTree from "./FilterTree"
import InvestigationLinear from "./Investigation/InvestigationLinear"
import Layout from "../state/Layout"
import Pane from "./Pane"
import usePopupMenu from "./hooks/usePopupMenu"
import get from "lodash/get"
import {Sectional} from "../../pkg/sectional"
import SavedSpacesList from "./SavedSpacesList"
import Spaces from "../state/Spaces"
import ConnectionStatuses from "../state/ConnectionStatuses"
import {TreeList} from "../../pkg/tree-list"
import Queries from "../state/Queries"
import Item from "./SideBar/Item"
import {MenuItemConstructorOptions, remote} from "electron"
import SearchBar from "../state/SearchBar"
import Notice from "../state/Notice"
import {submitSearch} from "../flows/submitSearch/mod"
import Search from "../state/Search"
import brim from "../brim"
import lib from "../lib"
import {popNotice} from "./PopNotice"

const Arrow = (props) => {
  return (
    <svg className={props.className} onClick={props.onClick} viewBox="0 0 8 8">
      <polygon points="0 0 8 4 0 8" />
    </svg>
  )
}

const StyledSection = styled.section`
  position: relative;
  min-height: 24px;
  display: flex;
  flex-direction: column;
`

const SectionContents = styled.div`
  flex: 1;
  overflow-y: auto;
`

const SectionHeader = styled.div`
  display: flex;
  background-color: var(--coconut);
  min-height: 24px;
  max-height: 24px;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 1px;
    box-shadow: inset 0 0.5px 0 0 var(--cloudy);
  }

  &::after {
    top: unset;
    bottom: 0;
    box-shadow: inset 0 -0.5px 0 0 var(--cloudy);
  }
`

const Title = styled.label`
  margin-left: 8px;
  line-height: 24px;

  ${(props) => props.theme.typography.headingList}
`

const StyledArrow = styled(Arrow)`
  fill: var(--aqua);
  opacity: 0.3;
  width: 8px;
  height: 8px;
  margin-left: 12px;
  transform: ${(props) => (props.show ? `rotate(90deg)` : "")};
  transition: transform 150ms;
`

const ClickRegion = styled.div`
  display: flex;
  align-items: center;
`

const StyledViewSelect = styled.div`
  ${(props) => props.theme.typography.labelSmall}
  ${(props) => props.theme.hoverQuiet}
  display: flex;
  margin-left: auto;
  margin-right: 8px;
  height: 18px;
  padding: 0 8px;
  line-height: 24px;
  flex-direction: row;
  align-items: center;
  text-transform: capitalize;
  border-radius: 3px;
  color: var(--slate);

  svg {
    stroke: var(--slate);
    margin-left: 6px;
    height: 8px;
    width: 8px;
  }
`

const DragAnchor = styled.div`
  position: absolute;
  width: 100%;
  height: 12px;
  top: -6px;
  left: 0;
  z-index: 1;
`

const EmptyText = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  color: var(--slate);
  margin-top: 110px;
  padding: 0 24px;
  text-align: center;
`

const ViewSelect = () => {
  const dispatch = useDispatch()
  const currentView = useSelector(Layout.getInvestigationView)

  const menu = usePopupMenu([
    {
      label: "Linear",
      click: () => dispatch(Layout.setInvestigationView("linear"))
    },
    {
      label: "Tree",
      click: () => dispatch(Layout.setInvestigationView("tree"))
    }
  ])

  return (
    <StyledViewSelect onClick={menu.onClick}>
      {currentView}
      <DropdownArrow />
    </StyledViewSelect>
  )
}

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

export function LeftPane() {
  const dispatch = useDispatch()
  const isOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const width = useSelector(Layout.getLeftSidebarWidth)
  const sections = useSelector(Layout.getSidebarSections).map((s) => ({
    ...s,
    min: 100,
    closedSize: 24
  }))

  const conn = useSelector(Current.getConnection)
  const id = get(conn, ["id"], "")
  const setSections = (sections) =>
    dispatch(Layout.setSidebarSections(sections))

  function onDragPane(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(Layout.setLeftSidebarWidth(Math.min(width, max)))
  }

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <Pane
      isOpen={isOpen}
      position="left"
      width={width}
      onDrag={onDragPane}
      className="history-pane"
    >
      {!id ? (
        <EmptyText>
          The connection previously on this tab has been removed.
        </EmptyText>
      ) : (
        <>
          <ClusterPicker />
          <Sectional sections={sections} onChange={setSections}>
            {(data, provided) => {
              if (data.id === "spaces")
                return (
                  <SpacesSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "queries")
                return (
                  <QueriesSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "history")
                return (
                  <HistorySection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              return null
            }}
          </Sectional>
        </>
      )}
    </Pane>
  )
}

function SpacesSection({isOpen, style, resizeProps, toggleProps}) {
  const conn = useSelector(Current.getConnection)
  const id = get(conn, ["id"], "")
  const connStatus = useSelector(ConnectionStatuses.get(id))
  const spaces = useSelector(Spaces.getSpaces(id))

  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Spaces</Title>
        </ClickRegion>
        <AddSpaceButton />
      </SectionHeader>
      <SectionContents>
        <SavedSpacesList spaces={spaces} connStatus={connStatus} />
      </SectionContents>
    </StyledSection>
  )
}

function HistorySection({isOpen, style, resizeProps, toggleProps}) {
  const view = useSelector(Layout.getInvestigationView)
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

function QueriesSection({isOpen, style, resizeProps, toggleProps}) {
  const dispatch = useDispatch()
  const contextArgs = useRef(null)
  const currentSpace = useSelector(Current.getSpace)
  const queriesRoot = useSelector(Queries.getRaw)
  const multiSelected = contextArgs.current && contextArgs.current.selections
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Run Query",
      enabled: !multiSelected,
      click: () => {
        if (!currentSpace)
          return dispatch(Notice.set(new Error("No space selected")))

        const {
          item: {value}
        } = contextArgs.current

        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(value))
        dispatch(Search.setSpanArgs(brim.space(currentSpace).everythingSpan()))
        dispatch(submitSearch())
      }
    },
    {
      label: "Copy Query",
      enabled: !multiSelected,
      click: () => {
        const {
          item: {value}
        } = contextArgs.current
        lib.doc.copyToClipboard(value)
        popNotice("Query copied to clipboard")
      }
    },
    {type: "separator"},
    {
      label: "Edit",
      enabled: !multiSelected,
      click: () => {
        // open edit modal
      }
    },
    {type: "separator"},
    {
      label: multiSelected ? "Delete Selected" : "Delete",
      click: () => {
        return remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Confirm Delete Query Window",
            message: `Are you sure you want to delete the ${contextArgs.current
              .selections.length || ""} selected quer${
              multiSelected ? "ies" : "y"
            }?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) {
              console.log("todo")
            }
          })
      }
    }
  ]

  const menu = usePopupMenu(template)

  function onItemClick(_, item) {
    console.log("clicked", item)
  }

  function onItemMove(sourceItem, destIndex) {
    console.log("moved", sourceItem, destIndex)
  }

  function onItemContextMenu(_, item, selections) {
    contextArgs.current = {item, selections}
    menu.open()
  }

  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Queries</Title>
        </ClickRegion>
        {/*change to add query*/}
        <AddSpaceButton />
      </SectionHeader>
      <TreeList
        root={queriesRoot}
        itemHeight={24}
        onItemMove={onItemMove}
        onItemClick={onItemClick}
        onItemContextMenu={onItemContextMenu}
      >
        {Item}
      </TreeList>
    </StyledSection>
  )
}
