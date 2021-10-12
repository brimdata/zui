import {includes} from "lodash"
import React, {ChangeEvent, useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import TreeModel from "tree-model"
import {Tree} from "react-arborist"
import useResizeObserver from "use-resize-observer"
import DropdownArrow from "../../icons/DropdownArrow"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import Current from "../../state/Current"
import Queries from "../../state/Queries"
import {Group, Query} from "../../state/Queries/types"
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
import styled from "styled-components"
import Modal from "../../state/Modal"
import {nanoid} from "@reduxjs/toolkit"
import useCallbackRef from "../hooks/useCallbackRef"
import {parseJSONLib} from "../../state/Queries/parsers"

const StyledPlus = styled.div`
  margin-left: auto;
  margin-right: 8px;
  background: rgba(0, 0, 0, 0);
  width: 24px;
  height: 18px;
  border-radius: 3px;
  text-align: center;
  line-height: 16px;
  font-weight: 300;
  font-size: 18px;
  color: var(--slate);
  ${(props) => props.theme.hoverQuiet}
`

const NewActionsDropdown = () => {
  const dispatch = useDispatch()
  const [importer, ref] = useCallbackRef<HTMLButtonElement>()

  const template = [
    {
      label: "New Query",
      click: () => dispatch(Modal.show("new-query"))
    },
    {
      label: "New Folder",
      click: () =>
        dispatch(
          Queries.addItem(
            {
              isOpen: false,
              items: [],
              name: "New Folder",
              id: nanoid()
            },
            "root"
          )
        )
    },
    {
      label: "Import from JSON...",
      click: () => importer.click()
    }
  ]

  const menu = usePopupMenu(template)

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const node = parseJSONLib(file)
    dispatch(Queries.addItem(node, "root"))
  }

  return (
    <>
      <StyledPlus onClick={menu.onClick}>+</StyledPlus>
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onImport}
      />
    </>
  )
}

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
  const [selectedTag, setSelectedTag] = useState("All")
  const currentPool = useSelector(Current.getPool)
  const queriesRoot = useSelector(Queries.getRaw)
  const [queries, setQueries] = useState(queriesRoot)
  const tags = useSelector(Queries.getTags)

  useEffect(() => {
    setQueries(queriesRoot)
  }, [queriesRoot])

  function onTagSelect(tag) {
    setSelectedTag(tag)
    if (tag === "All") {
      setQueries(queriesRoot)
      return
    }
    setQueries({
      id: "root",
      name: "root",
      isOpen: true,
      items: filterQueriesByTag(queriesRoot, tag)
    })
  }

  const handleMove = (
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => {
    if (selectedTag !== "All") return
    dispatch(Queries.moveItems(dragIds, parentId, index))
  }

  const handleRename = (itemId: string, name: string) =>
    dispatch(Queries.editItem({name}, itemId))

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
          <>
            <TagsViewSelect
              selected={selectedTag}
              tags={["All", ...tags]}
              onSelect={onTagSelect}
            />
            <NewActionsDropdown />
          </>
        )}
      </SectionHeader>
      <SectionContents ref={ref}>
        {currentPool ? (
          <Tree
            data={queries}
            childrenAccessor="items"
            isOpenAccessor="isOpen"
            rowHeight={24}
            width={width}
            height={height}
            hideRoot
            openByDefault
            onMove={handleMove}
            onEdit={handleRename}
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
