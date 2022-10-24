import React, {useEffect, useRef} from "react"
import {Tree, TreeApi} from "react-arborist"
import {useSelector} from "react-redux"
import {deleteQueries} from "src/app/commands/delete-queries"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import {queryTreeContextMenu} from "src/app/menus/query-tree-context-menu"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import {Group, Query} from "src/js/state/Queries/types"
import RemoteQueries from "src/js/state/RemoteQueries"
import {refreshRemoteQueries} from "src/js/state/RemoteQueries/flows/remote-queries"
import {DropOverlay} from "../drop-overlay"
import {useQueryImportOnDrop} from "../hooks"
import {FillFlexParent} from "src/components/fill-flex-parent"
import QueryItem from "./query-item"

type Props = {
  source: "local" | "remote"
  searchTerm: string
}

export function QueriesTree(props: Props) {
  switch (props.source) {
    case "local":
      return <LocalQueriesTree {...props} />
    case "remote":
      return <RemoteQueriesTree {...props} />
    default:
      return null
  }
}

function LocalQueriesTree({searchTerm}: Props) {
  const queries = useSelector(Queries.raw).items

  return <QueryTree queries={queries} searchTerm={searchTerm} type="local" />
}

function RemoteQueriesTree({searchTerm}) {
  const dispatch = useDispatch()
  const queries = useSelector(RemoteQueries.raw).items
  useEffect(() => {
    dispatch(refreshRemoteQueries())
  }, [])
  return <QueryTree queries={queries} searchTerm={searchTerm} type="remote" />
}

function QueryTree(props: {
  queries: (Query | Group)[]
  searchTerm: string
  type: "local" | "remote"
}) {
  const dispatch = useDispatch()
  const api = useBrimApi()
  const id = useSelector(Current.getQueryId)
  const tree = useRef<TreeApi<Query | Group>>()
  const [{isOver}, drop] = useQueryImportOnDrop()
  return (
    <>
      <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      <FillFlexParent ref={drop}>
        {(dimens) => {
          return (
            <Tree
              {...dimens}
              padding={8}
              disableDrag={props.type === "remote"}
              ref={tree}
              selection={id}
              className="sidebar-tree"
              searchTerm={props.searchTerm}
              searchMatch={(node, term) =>
                node.data.name.toLowerCase().includes(term.toLowerCase())
              }
              indent={16}
              rowHeight={28}
              data={props.queries}
              getChildren="items"
              onActivate={(node) => {
                if (node.isLeaf && id !== node.id) api.queries.open(node.id)
              }}
              onMove={(args) => {
                dispatch(
                  Queries.moveItems(args.dragIds, args.parentId, args.index)
                )
              }}
              onRename={async (args) => {
                await api.queries.update({
                  id: args.id,
                  changes: {name: args.name},
                })
              }}
              onCreate={({type, parentId}) => {
                if (type === "leaf") {
                  return api.queries.create({
                    name: "",
                    parentId,
                    type: props.type,
                  })
                } else {
                  return api.queries.createGroup("", parentId)
                }
              }}
              onDelete={(args) => {
                deleteQueries.run(args.ids)
              }}
              onContextMenu={() => {
                if (tree.current) {
                  queryTreeContextMenu.build(tree.current).show()
                }
              }}
            >
              {QueryItem}
            </Tree>
          )
        }}
      </FillFlexParent>
    </>
  )
}
