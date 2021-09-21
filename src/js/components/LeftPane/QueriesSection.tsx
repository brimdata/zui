import {MenuItemConstructorOptions, remote} from "electron"
import {includes} from "lodash"
import React, {useEffect, useState} from "react"
import toast from "react-hot-toast"
import {useDispatch, useSelector} from "react-redux"
import TreeModel from "tree-model"
import {Tree} from "react-arborist"
import useResizeObserver from "use-resize-observer"
import {submitSearch} from "../../flows/submitSearch/mod"
import DropdownArrow from "../../icons/DropdownArrow"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import lib from "../../lib"
import Current from "../../state/Current"
import Modal from "../../state/Modal"
import Notice from "../../state/Notice"
import Queries from "../../state/Queries"
import {Group, Query} from "../../state/Queries/types"
import SearchBar from "../../state/SearchBar"
import EmptySection from "../common/EmptySection"
import usePopupMenu from "../hooks/usePopupMenu"
import Item from "../SideBar/Item"
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

const filterQueriesByTag = (queriesRoot: Group, tag: string): Query[] => {
  const queryResults = []
  new TreeModel({childrenPropertyName: "items"})
    .parse(queriesRoot)
    .walk((n) => {
      if (!n.model.tags) return true
      if (includes(n.model.tags, tag)) queryResults.push(n.model)

      return true
    })

  return queryResults
}

const TagsViewSelect = ({selected, tags, onSelect}) => {
  const template = tags.map((t) => ({
    label: t,
    click: () => onSelect(t),
    type: "checkbox",
    checked: selected === t
  }))

  template.unshift(
    ...[
      {
        label: "Filter by tag",
        enabled: false
      },
      {type: "separator"}
    ]
  )

  const menu = usePopupMenu(template)

  return (
    <StyledViewSelect onClick={menu.onClick}>
      {selected}
      <DropdownArrow />
    </StyledViewSelect>
  )
}

function QueriesSection({isOpen, style, resizeProps, toggleProps}) {
  const dispatch = useDispatch()
  const [contextArgs, setContextArgs] = useState(null)
  const [selectedTag, setSelectedTag] = useState("All")
  const currentPool = useSelector(Current.getPool)
  const queriesRoot = useSelector(Queries.getRaw)
  const [queries, setQueries] = useState(queriesRoot)
  const tags = useSelector(Queries.getTags)
  const hasMultiSelected = contextArgs && contextArgs.selections.length > 1

  useEffect(() => {
    setQueries(queriesRoot)
  }, [queriesRoot])

  const runQuery = (value) => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(value))
    dispatch(submitSearch())
  }

  const menu = usePopupMenu(template)

  function _onItemClick(_, item) {
    if (!currentPool)
      return dispatch(
        Notice.set({type: "NoPoolError", message: "No Pool Selected"})
      )

    if (!item.value) return

    runQuery(item.value)
  }

  function _onItemMove(sourceItem, destIndex) {
    if (selectedTag !== "All") return
    dispatch(Queries.moveItems([sourceItem], queriesRoot, destIndex))
  }

  function onTagSelect(tag) {
    setSelectedTag(tag)
    if (tag === "All") {
      setQueries(queriesRoot)
      return
    }
    setQueries({
      id: "root",
      name: "root",
      items: filterQueriesByTag(queriesRoot, tag)
    })
  }

  // trigger menu open after contextArgs have updated so it renders with fresh data
  useEffect(() => {
    if (!contextArgs) return
    menu.open()
  }, [contextArgs])

  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Queries</Title>
        </ClickRegion>
        {currentPool && (
          <TagsViewSelect
            selected={selectedTag}
            tags={["All", ...tags]}
            onSelect={onTagSelect}
          />
        )}
      </SectionHeader>
      <SectionContents ref={ref}>
        {currentPool ? (
          <Tree
            data={queries}
            // @ts-ignore
            getChildren={(n) => ("items" in n ? n.items : undefined)}
            getIsOpen={() => true}
            rowHeight={24}
            width={width}
            height={height}
            hideRoot
            // onItemMove={onItemMove}
            // onItemClick={onItemClick}
          >
            {Item}
          </Tree>
        ) : (
          <EmptySection
            icon={<MagnifyingGlass />}
            message="You must have a pool selected to run queries."
          />
        )}
      </SectionContents>
    </StyledSection>
  )
}

export default QueriesSection
