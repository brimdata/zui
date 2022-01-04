import React, {useEffect, useState} from "react"
import {Tree} from "react-arborist"
import {useDispatch, useSelector} from "react-redux"
import Queries from "src/js/state/Queries"
import {isBrimLib} from "src/js/state/Queries/flows"
import {
  SectionContents,
  StyledSection,
  DropOverlay,
  SectionToolbar,
  ButtonRow,
  SectionSearch
} from "../common"
import QueryItem from "./query-item"
import {useQueryImportOnDrop, useSectionTreeDefaults} from "../hooks"
import Appearance from "src/js/state/Appearance"
import {capitalize, find} from "lodash"
import {QueriesView} from "../../../state/Appearance/types"
import TreeModel from "tree-model"
import RemoteQueries from "src/js/state/RemoteQueries"
import {Query} from "../../../state/Queries/types"
import {refreshRemoteQueries, setRemoteQueries} from "../flows/remote-queries"
import {AppDispatch} from "../../../state/types"
import styled from "styled-components"
import EmptySection from "src/js/components/common/EmptySection"
import Icon from "app/core/Icon"

const StyledEmptySection = styled(EmptySection).attrs({
  icon: <Icon name="query" />
})``

const QueriesSectionSwitch = ({view, toolbarButtons}) => {
  switch (view) {
    case "local":
      return <LocalQueriesView toolbarButtons={toolbarButtons} />
    case "remote":
      return <RemoteQueriesView toolbarButtons={toolbarButtons} />
    default:
      return null
  }
}

const querySearch = (term: string, items: Query[]): Query[] => {
  return items?.filter(({name, value, description}) =>
    JSON.stringify({name, value, description})
      .toLowerCase()
      .includes(term.toLowerCase())
  )
}

const RemoteQueriesView = ({toolbarButtons}) => {
  const dispatch = useDispatch<AppDispatch>()
  const remoteQueries = useSelector(RemoteQueries.get)?.items
  const [filteredQueries, setFilteredQueries] = useState(remoteQueries)
  const {resizeRef: ref, defaults} = useSectionTreeDefaults()

  useEffect(() => {
    dispatch(refreshRemoteQueries())
  }, [])

  useEffect(() => {
    setFilteredQueries(remoteQueries)
  }, [remoteQueries])

  const handleRename = (itemId: string, name: string) => {
    const q = find(remoteQueries, ["id", itemId]) as Query
    if (!q) return console.error("cannot locate remote query with id " + itemId)
    dispatch(setRemoteQueries([{...q, name}])).then(() => {
      dispatch(refreshRemoteQueries())
    })
  }

  const onQuerySearch = (e) => {
    setFilteredQueries(querySearch(e.target?.value, remoteQueries))
  }

  const renderContents = () => {
    if (!remoteQueries?.length)
      return (
        <StyledEmptySection message="You have not created any remote queries yet." />
      )
    if (!filteredQueries?.length)
      return <StyledEmptySection message="No queries match the search term." />
    return (
      <Tree
        {...defaults}
        data={{id: "root", items: filteredQueries}}
        onEdit={handleRename}
        onToggle={(id, value) => {
          dispatch(Queries.toggleGroup(id, value))
        }}
      >
        {QueryItem}
      </Tree>
    )
  }

  return (
    <>
      <SectionContents ref={ref}>{renderContents()}</SectionContents>
      <SectionToolbar>
        <ButtonRow buttons={toolbarButtons} />
        <SectionSearch
          placeholder="Search Remote Queries..."
          onChange={onQuerySearch}
        />
      </SectionToolbar>
    </>
  )
}

const flattenQueryTree = (root, includeFolders = true) => {
  return new TreeModel({childrenPropertyName: "items"}).parse(root).all((n) => {
    return n.model.id !== "root" && (includeFolders || !("items" in n))
  })
}

const LocalQueriesView = ({toolbarButtons}) => {
  const dispatch = useDispatch()
  const {resizeRef: ref, defaults} = useSectionTreeDefaults()
  const [{isOver}, drop] = useQueryImportOnDrop()
  const queries = useSelector(Queries.getRaw)
  const [filteredQueries, setFilteredQueries] = useState(queries)

  const flatLib = flattenQueryTree(queries)
  const flatQueries = flatLib.filter((n) => !("items" in n))
  const filteredQueriesCount = flattenQueryTree(filteredQueries, false)?.length
  const isFiltered = flatQueries?.length !== filteredQueriesCount

  useEffect(() => {
    setFilteredQueries(queries)
  }, [queries])

  const onQuerySearch = (e) => {
    const searchTerm = e.target?.value
    if (!searchTerm) {
      return setFilteredQueries(queries)
    }
    const queryModels = flatQueries.map((n) => n.model)

    setFilteredQueries({
      id: "root",
      name: "root",
      items: querySearch(searchTerm, queryModels)
    })
  }

  const handleMove = (
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => {
    // no reordering if any one item is part of shipped brim lib
    if (isFiltered || dispatch(isBrimLib([...dragIds, parentId]))) return
    dispatch(Queries.moveItems(dragIds, parentId, index))
  }

  const handleRename = (itemId: string, name: string) =>
    dispatch(Queries.editItem({name}, itemId))

  const renderContents = () => {
    if (!flatLib.length)
      return (
        <StyledEmptySection message="You have not created any local queries yet." />
      )
    if (!filteredQueriesCount)
      return <StyledEmptySection message="No queries match the search term." />
    return (
      <Tree
        {...defaults}
        data={filteredQueries}
        disableDrag={(d) => !!dispatch(isBrimLib([d.id]))}
        disableDrop={(d) => d.id === "brim"}
        onMove={handleMove}
        onEdit={handleRename}
        onToggle={(id, value) => {
          dispatch(Queries.toggleGroup(id, value))
        }}
      >
        {QueryItem}
      </Tree>
    )
  }

  return (
    <>
      <SectionContents
        ref={(r) => {
          ref(r)
          drop(r)
        }}
      >
        {renderContents()}
        <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      </SectionContents>
      <SectionToolbar>
        <ButtonRow buttons={toolbarButtons} />
        <SectionSearch
          placeholder="Search Local Queries..."
          onChange={onQuerySearch}
        />
      </SectionToolbar>
    </>
  )
}

function QueriesSection() {
  const dispatch = useDispatch()
  const queriesView = useSelector(Appearance.getQueriesView)

  const toolbarButtons = ["local", "remote"].map((view: QueriesView) => ({
    label: capitalize(view),
    onClick: () => dispatch(Appearance.setQueriesView(view)),
    isSelected: view === queriesView
  }))

  return (
    <StyledSection>
      <QueriesSectionSwitch
        view={queriesView}
        toolbarButtons={toolbarButtons}
      />
    </StyledSection>
  )
}

export default QueriesSection
