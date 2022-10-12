import React from "react"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import Queries from "src/js/state/Queries"
import {FillFlexParent} from "../pools-section/fill-flex-parent"
import QueryItem from "./query-item"

export function RemoteQueriesTree(props: {searchTerm: string}) {
  const dispatch = useDispatch()
  const root = useSelector(Queries.raw)
  const api = useBrimApi()
  return (
    <FillFlexParent>
      {(dimens) => {
        return (
          <Tree
            {...dimens}
            searchTerm={props.searchTerm}
            searchMatch={(query, term) =>
              query.name.toLowerCase().includes(term)
            }
            indent={16}
            rowHeight={28}
            data={root}
            getChildren="items"
            onSelect={(queries) => {
              // Also check if it's a folder. Don't open a folder.
              if (queries.length === 1) api.queries.open(queries[0].id)
            }}
            onMove={(args) => {
              dispatch(
                Queries.moveItems(args.dragIds, args.parentId, args.index)
              )
            }}
            onRename={(args) => {
              dispatch(Queries.editItem({name: args.name}, args.id))
            }}
            onContextMenu={() => {
              // dispatch(listContextMenu(tree?.current))
            }}
          >
            {QueryItem}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}
