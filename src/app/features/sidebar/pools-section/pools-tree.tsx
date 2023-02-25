import React, {useMemo, useRef} from "react"
import {NodeApi, Tree, TreeApi} from "react-arborist"
import {useSelector} from "react-redux"
import {deletePools} from "src/app/commands/delete-pools"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {lakePoolPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {Empty} from "./empty"
import {FillFlexParent} from "src/components/fill-flex-parent"
import PoolItem from "./pool-item"
import {groupByDelimiter, Internal} from "./group-by"
import {useZuiApi} from "src/app/core/context"
import * as poolCmd from "src/app/commands/pools"
import Config from "src/js/state/Config"
import {Pool} from "src/app/core/pools/pool"
import {PoolName} from "./pool-name"
import Appearance from "src/js/state/Appearance"

export function PoolsTree(props: {searchTerm: string}) {
  const dispatch = useDispatch()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const api = useZuiApi()
  const pools = useSelector(Current.getPools)
  const delimiter = useSelector(Config.getPoolNameDelimiter)
  const data = useMemo(
    () => groupByDelimiter(pools, delimiter),
    [pools, delimiter]
  )
  const initialOpenState = useSelector(Appearance.getPoolsOpenState)
  const tree = useRef<TreeApi<any>>()

  if (data.length === 0) {
    return (
      <Empty message="You have no pools yet. Create a pool by importing data." />
    )
  }

  return (
    <FillFlexParent>
      {(dimens) => {
        return (
          <Tree
            ref={tree}
            initialOpenState={initialOpenState}
            onToggle={() => {
              const t = tree.current
              if (t) dispatch(Appearance.setPoolsOpenState(t.openState))
            }}
            disableDrag
            disableDrop
            indent={16}
            rowHeight={28}
            padding={8}
            height={dimens.height}
            width={dimens.width}
            data={data}
            searchTerm={props.searchTerm}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase())
            }
            selection={poolId}
            onRename={({id, name, node}) => {
              if (isInternal(node)) {
                poolCmd.renameGroup.run(node.data.group, name)
              } else {
                poolCmd.rename.run(id, name)
              }
            }}
            onActivate={(node) => {
              if (node.isLeaf) {
                dispatch(Tabs.previewUrl(lakePoolPath(node.id, lakeId)))
              }
            }}
            onDelete={(args) => {
              let ids = new Set<string>()
              for (let node of args.nodes) {
                if (isInternal(node)) {
                  for (let pool of api.pools.all) {
                    const poolName = new PoolName(pool.name, delimiter)
                    if (poolName.isIn(node.data.group)) ids.add(pool.id)
                  }
                } else {
                  ids.add(node.id)
                }
              }
              deletePools.run(Array.from(ids))
            }}
          >
            {PoolItem}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}

function isInternal(node: NodeApi<Internal | Pool>): node is NodeApi<Internal> {
  return node.isInternal
}
