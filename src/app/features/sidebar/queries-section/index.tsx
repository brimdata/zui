import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {SwitchButton} from "src/app/core/components/switch-button"
import Appearance from "src/js/state/Appearance"
import {Content} from "../content"
import {SearchBar} from "../search-bar"
import {Toolbar} from "../toolbar"
import {QueriesTree} from "./queries-tree"

// const RemoteQueriesView = ({toolbarButtons}) => {
//   )
//   // useEffect(() => {
//   //   dispatch(refreshRemoteQueries())
//   // }, [])
//   const handleRename = (itemId: string, name: string) => {
//     const q = find(remoteQueries, ["id", itemId]) as Query
//     if (!q) return console.error("cannot locate remote query with id " + itemId)
//     if (q.isReadOnly) return
//     const versions =
//       Object.values<QueryVersion>(queryVersions[itemId]?.entities ?? {}) || []
//     const brimQ = new BrimQuery(q, versions)
//     dispatch(
//       setRemoteQueries([{...brimQ.serialize(), name, ...brimQ.latestVersion()}])
//     )
//   }

//   const renderContents = () => {
//     if (!remoteQueries?.length)
//       return (
//         <StyledEmptySection message="You have not created any remote queries yet." />
//       )
//     if (!filteredQueries?.length)
//       return <StyledEmptySection message="No queries match the search term." />
//     return (
//       <Tree
//         data={{id: "root", items: filteredQueries}}
//         onEdit={handleRename}
//       >
//         {QueryItem}
//       </Tree>
//     )
//   }

//   return (
//     <>
//       <SectionContents ref={ref}>{renderContents()}</SectionContents>
//       <SectionToolbar>
//         <ButtonRow buttons={toolbarButtons} />
//         <SectionSearch
//           placeholder="Search Remote Queries..."
//           onChange={onQuerySearch}
//         />
//       </SectionToolbar>
//     </>
//   )
// }

// const LocalQueriesView = ({toolbarButtons}) => {
//   const [{isOver}, drop] = useQueryImportOnDrop()
//   const [searchTerm]
//   return (
//     <>
//       <SectionContents ref={drop}>
//         {renderContents()}
//         <DropOverlay show={isOver}>Drop to import...</DropOverlay>
//       </SectionContents>
//       <SectionToolbar>
//         <ButtonRow buttons={toolbarButtons} />
//         <SectionSearch
//           placeholder="Search Local Queries..."
//           onChange={onQuerySearch}
//         />
//       </SectionToolbar>
//     </>
//   )
// }

export function QueriesSection() {
  const dispatch = useDispatch()
  const view = useSelector(Appearance.getQueriesView)

  const [searchTerm, setSearchTerm] = useState("")
  return (
    <>
      <Content>
        <QueriesTree source={view} searchTerm={searchTerm} />
      </Content>
      <Toolbar>
        <SwitchButton
          options={[
            {
              label: "Local",
              click: () => dispatch(Appearance.setQueriesView("local")),
              active: "local" === view,
            },
            {
              label: "Remote",
              click: () => dispatch(Appearance.setQueriesView("remote")),
              active: "remote" === view,
            },
          ]}
        />
        <SearchBar
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Toolbar>
    </>
  )
}
