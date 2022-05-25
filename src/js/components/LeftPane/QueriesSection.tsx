import {nanoid} from "@reduxjs/toolkit"
import {useBrimApi} from "src/app/core/context"
import {find, includes} from "lodash"
import React, {ChangeEvent, useEffect, useRef, useState} from "react"
import {Tree, TreeApi} from "react-arborist"
import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import TreeModel from "tree-model"
import useResizeObserver from "use-resize-observer"
import DropdownArrow from "../../icons/DropdownArrow"
import MagnifyingGlass from "../../icons/MagnifyingGlass"
import Modal from "../../state/Modal"
import Queries from "../../state/Queries"
import {isChildOf} from "../../state/Queries/flows"
import {Group, Query} from "../../state/Queries/types"
import EmptySection from "../common/EmptySection"
import useCallbackRef from "../hooks/useCallbackRef"
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
  Title,
} from "./common"
import {DropOverlay} from "./drop-overlay"
import {refreshRemoteQueries, setRemoteQueries} from "./remote-queries"
import {AppDispatch} from "../../state/types"
import RemoteQueries from "src/js/state/RemoteQueries"
import getQueryById from "src/app/query-home/flows/get-query-by-id"

const StyledPlus = styled.div`
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

const NewActionsDropdown = (props: {
  tree: TreeApi | undefined
  isRemote: boolean
}) => {
  const {tree, isRemote} = props
  const dispatch = useDispatch()
  const api = useBrimApi()
  const [importer, ref] = useCallbackRef<HTMLButtonElement>()
  const template = isRemote
    ? [
        {
          label: "New Remote Query",
          click: () => dispatch(Modal.show("new-query", {isRemote: true})),
        },
      ]
    : [
        {
          label: "New Query",
          click: () => dispatch(Modal.show("new-query")),
        },
        {
          label: "New Folder",
          click: () => {
            const id = nanoid()
            dispatch(
              Queries.addItem(
                {
                  isOpen: true,
                  items: [],
                  name: "New Folder",
                  id,
                },
                "root"
              )
            )
            tree?.scrollToId(id)
            tree?.edit(id)
          },
        },
        {
          label: "Import from JSON...",
          click: () => importer && importer.click(),
        },
      ]

  const menu = usePopupMenu(template)

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      api.importQueries(file)
    }
    e.target.value = null
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
  const template = tags.map((t) => {
    if (t === "separator") return {type: "separator"}
    return {
      label: t,
      click: () => onSelect(t),
      type: "checkbox",
      checked: selected === t,
    }
  })

  template.unshift(
    ...[
      {
        label: "Filter by tag",
        enabled: false,
      },
      {type: "separator"},
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
type DragItem = {files: File[]; items: DataTransferItemList}
function QueriesSection({isOpen, style, resizeProps, toggleProps}) {
  const api = useBrimApi()
  const tree = useRef()
  const dispatch = useDispatch<AppDispatch>()
  const [selectedTag, setSelectedTag] = useState("All Local")
  const queriesRoot = useSelector(Queries.raw)
  const remoteQueries = useSelector(RemoteQueries.raw)
  const [queries, setQueries] = useState<Group>(queriesRoot)
  const tags = useSelector(Queries.getTags)
  const [{isOver}, drop] = useDrop<DragItem, unknown, {isOver: boolean}>(
    () => ({
      accept: [NativeTypes.FILE],
      drop: ({files}) => {
        if (files && files[0]) {
          api.importQueries(files[0])
        }
      },
      collect: (m) => ({
        isOver: m.isOver(),
      }),
    })
  )

  useEffect(() => {
    if (selectedTag !== "Remote") {
      setQueries(queriesRoot)
    }
  }, [queriesRoot])

  useEffect(() => {
    if (selectedTag === "Remote") {
      setQueries(remoteQueries)
    }
  }, [remoteQueries])

  const defaultRoot = {
    id: "root",
    name: "root",
    isOpen: true,
    items: null,
  }

  function onTagSelect(tag) {
    setSelectedTag(tag)
    if (tag === "All Local") {
      setQueries(queriesRoot)
      return
    }

    if (tag === "Remote") {
      dispatch(refreshRemoteQueries())
      return
    }
    setQueries({...defaultRoot, items: filterQueriesByTag(queriesRoot, tag)})
  }

  const handleMove = (
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => {
    // no reordering while a filter is on
    if (selectedTag !== "All Local") return
    // no reordering if any one item is part of shipped brim lib
    if (dispatch(isChildOf("brim", [...dragIds, parentId]))) return
    dispatch(Queries.moveItems(dragIds, parentId, index))
  }

  const handleRename = (itemId: string, name: string) => {
    if (selectedTag === "Remote") {
      const q = find(queries.items, ["id", itemId]) as Query
      if (!q) return console.error("cannot locate query with id " + itemId)
      const brimQ = dispatch(getQueryById(q.id))
      dispatch(
        setRemoteQueries([
          {...brimQ.serialize(), name, ...brimQ.latestVersion()},
        ])
      ).then(() => {
        dispatch(refreshRemoteQueries())
      })
      return
    }
    dispatch(Queries.editItem({name}, itemId))
  }

  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  const renderQueries = () => {
    if (!(queries?.items?.length > 0))
      return (
        <EmptySection
          icon={<MagnifyingGlass />}
          message="You have not created any queries yet."
        />
      )

    return (
      <Tree
        ref={tree}
        indent={12}
        data={queries}
        getChildren="items"
        isOpen="isOpen"
        disableDrag={(d) => !!dispatch(isChildOf("brim", [d.id]))}
        disableDrop={(d) => d.id === "brim"}
        rowHeight={24}
        width={width}
        height={height}
        hideRoot
        openByDefault
        onMove={handleMove}
        onEdit={handleRename}
        onToggle={(id, value) => {
          dispatch(Queries.toggleGroup(id, value))
        }}
      >
        {Item}
      </Tree>
    )
  }
  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Queries</Title>
        </ClickRegion>
        <TagsViewSelect
          selected={selectedTag}
          tags={["Remote", "separator", "All Local", ...tags]}
          onSelect={onTagSelect}
        />
        <NewActionsDropdown
          tree={tree.current}
          isRemote={selectedTag === "Remote"}
        />
      </SectionHeader>
      <SectionContents
        ref={(r) => {
          ref(r)
          drop(r)
        }}
      >
        {renderQueries()}
        <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      </SectionContents>
    </StyledSection>
  )
}

export default QueriesSection
