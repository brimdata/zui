import React, {useRef} from "react"
import {Tree, TreeApi} from "react-arborist"
import {useSelector} from "react-redux"
import {deleteQueries} from "src/app/commands/delete-queries"
import {useZuiApi} from "src/views/application/context"
import {useDispatch} from "src/core/use-dispatch"
import {queryTreeContextMenu} from "src/app/menus/query-tree-context-menu"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import {Group, Query} from "src/js/state/Queries/types"
import {DropOverlay} from "../drop-overlay"
import {useQueryImportOnDrop} from "../hooks"
import {FillFlexParent} from "src/components/fill-flex-parent"
import QueryItem from "./query-item"
import {selectQuery} from "src/views/sidebar/queries-section/select-query-event"
import Appearance from "src/js/state/Appearance"
import {TREE_ITEM_HEIGHT} from "../item"
import {showMenu} from "src/core/menu"
import EmptySection from "src/components/empty-section"
import {NamedQueries} from "src/domain/handlers"
import {NamedQuery} from "src/models/named-query"

type Props = {
  searchTerm: string
}

export function QueriesTree({searchTerm}: Props) {
  const queries = useSelector(Queries.raw).items
  if (queries.length) {
    return <TreeOfQueries queries={queries} searchTerm={searchTerm} />
  } else {
    return (
      <EmptySection message="Local queries you've saved will be listed here." />
    )
  }
}

function TreeOfQueries(props: {
  queries: (Query | Group)[]
  searchTerm: string
}) {
  const dispatch = useDispatch()
  const api = useZuiApi()
  const id = useSelector(Current.getSessionRouteParentId)
  const tree = useRef<TreeApi<Query | Group>>()
  const [{isOver}, drop] = useQueryImportOnDrop()
  const initialOpenState = useSelector(Appearance.getQueriesOpenState)
  selectQuery.useListener((id) => tree.current?.select(id))

  return (
    <>
      <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      <FillFlexParent ref={drop}>
        {(dimens) => {
          return (
            <Tree
              {...dimens}
              onToggle={() => {
                const t = tree.current
                if (t) dispatch(Appearance.setQueriesOpenState(t.openState))
              }}
              initialOpenState={initialOpenState}
              openByDefault={false}
              padding={8}
              ref={tree}
              selection={id}
              className="sidebar-tree"
              searchTerm={props.searchTerm}
              searchMatch={(node, term) =>
                node.data.name.toLowerCase().includes(term.toLowerCase())
              }
              indent={16}
              rowHeight={TREE_ITEM_HEIGHT}
              data={props.queries}
              childrenAccessor="items"
              onActivate={(node) => {
                if (node.isLeaf && id !== node.id) {
                  NamedQueries.show(node.id)
                }
              }}
              onMove={(args) => {
                dispatch(
                  Queries.moveItems(args.dragIds, args.parentId, args.index)
                )
              }}
              onRename={async (args) => {
                NamedQuery.find(args.id).update({name: args.name})
              }}
              onCreate={({type, parentId}) => {
                if (type === "leaf") {
                  return NamedQuery.create({
                    name: "",
                    parentId,
                    value: "",
                    pins: [],
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
                  showMenu(queryTreeContextMenu(tree.current))
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
