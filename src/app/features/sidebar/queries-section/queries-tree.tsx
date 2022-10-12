import React, {useRef} from "react"
import {Tree, TreeApi} from "react-arborist"
import {useSelector} from "react-redux"
import {deleteQueries} from "src/app/commands/delete-queries"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import {queryTreeContextMenu} from "src/app/menus/query-tree-context-menu"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import {Group, Query} from "src/js/state/Queries/types"
import {FillFlexParent} from "../pools-section/fill-flex-parent"
import QueryItem from "./query-item"

export function QueriesTree(props: {searchTerm: string}) {
  const dispatch = useDispatch()
  const root = useSelector(Queries.raw)
  const api = useBrimApi()
  const id = useSelector(Current.getQueryId)
  const tree = useRef<TreeApi<Query | Group>>()
  return (
    <FillFlexParent>
      {(dimens) => {
        return (
          <Tree
            {...dimens}
            ref={tree}
            selection={id}
            className="sidebar-tree"
            searchTerm={props.searchTerm}
            searchMatch={(query, term) =>
              query.name.toLowerCase().includes(term)
            }
            indent={16}
            rowHeight={28}
            data={root.items}
            getChildren="items"
            onSelect={(queries) => {
              if (queries.length === 1 && !("items" in queries[0])) {
                api.queries.open(queries[0].id)
              }
            }}
            onMove={(args) => {
              dispatch(
                Queries.moveItems(args.dragIds, args.parentId, args.index)
              )
            }}
            onRename={(args) => {
              dispatch(Queries.editItem({name: args.name}, args.id))
            }}
            onCreate={({type, parentId}) => {
              if (type === "leaf") {
                return api.queries.create("", parentId)
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
  )
}
