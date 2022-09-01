import React, {useEffect, useRef, useState} from "react"
import {Tree, TreeApi} from "react-arborist"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Queries from "src/js/state/Queries"
import {
  SectionContents,
  StyledSection,
  DropOverlay,
  SectionToolbar,
  ButtonRow,
  SectionSearch,
} from "../common"
import QueryItem from "./query-item"
import {useQueryImportOnDrop, useSectionTreeDefaults} from "../hooks"
import Appearance from "src/js/state/Appearance"
import {capitalize, find} from "lodash"
import {QueriesView} from "src/js/state/Appearance/types"
import RemoteQueries from "src/js/state/RemoteQueries"
import {Query} from "src/js/state/Queries/types"
import {
  refreshRemoteQueries,
  setRemoteQueries,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import styled from "styled-components"
import EmptySection from "src/js/components/common/EmptySection"
import Icon from "src/app/core/icon-temp"
import {listContextMenu} from "./list-context-menu"
import Current from "src/js/state/Current"
import {BrimQuery} from "../../../query-home/utils/brim-query"
import {
  QueryVersion,
  QueryVersionsState,
} from "src/js/state/QueryVersions/types"
import {flattenQueryTree} from "src/js/state/Queries/helpers"
import {State} from "src/js/state/types"

const StyledEmptySection = styled(EmptySection).attrs({
  icon: <Icon name="query" />,
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
  return items?.filter(({name, description}) =>
    JSON.stringify({name, description})
      .toLowerCase()
      .includes(term.toLowerCase())
  )
}

const RemoteQueriesView = ({toolbarButtons}) => {
  const dispatch = useDispatch()
  const remoteQueries = useSelector(RemoteQueries.raw)?.items
  const queryVersions = useSelector<State, QueryVersionsState>(
    (state) => state.queryVersions
  )
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
    if (q.isReadOnly) return
    const versions =
      Object.values<QueryVersion>(queryVersions[itemId]?.entities ?? {}) || []
    const brimQ = new BrimQuery(q, versions)
    dispatch(
      setRemoteQueries([{...brimQ.serialize(), name, ...brimQ.latestVersion()}])
    )
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

const LocalQueriesView = ({toolbarButtons}) => {
  const dispatch = useDispatch()
  const tree = useRef<TreeApi<any> | null>(null)
  const {resizeRef: ref, defaults} = useSectionTreeDefaults()
  const [{isOver}, drop] = useQueryImportOnDrop()
  const queries = useSelector(Queries.raw)
  const [filteredQueries, setFilteredQueries] = useState(queries)

  const flatLib = flattenQueryTree(queries)
  const flatQueries = flatLib.filter((n) => !("items" in n))

  const filteredQueriesCount = flattenQueryTree(filteredQueries, false)?.length
  const isFiltered = flatQueries?.length !== filteredQueriesCount

  const query = useSelector(Current.getNamedQuery)

  useEffect(() => {
    if (!query?.id) {
      tree?.current?.select(null, false, false)
    } else if (!tree?.current?.getSelectedIds().includes(query.id)) {
      tree?.current?.scrollToId(query.id)
      tree?.current?.selectById(query.id)
    }
  }, [query?.id])

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
      items: querySearch(searchTerm, queryModels),
    })
  }

  const handleMove = (
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => {
    // no movement allowed if using a filter
    if (isFiltered) return
    dispatch(Queries.moveItems(dragIds, parentId, index))
  }

  const handleRename = (itemId: string, name: string) => {
    dispatch(Queries.editItem({name}, itemId))
  }

  const renderContents = () => {
    if (!flatLib.length)
      return (
        <StyledEmptySection message="You have not created any local queries yet." />
      )
    if (!filteredQueriesCount)
      return <StyledEmptySection message="No queries match the search term." />

    return (
      <Tree
        ref={tree}
        {...defaults}
        disableDrag={false}
        disableDrop={false}
        data={filteredQueries}
        onMove={handleMove}
        onEdit={handleRename}
        onToggle={(id, value) => {
          dispatch(Queries.toggleGroup(id, value))
        }}
        onContextMenu={() => dispatch(listContextMenu(tree?.current))}
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
    isSelected: view === queriesView,
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
