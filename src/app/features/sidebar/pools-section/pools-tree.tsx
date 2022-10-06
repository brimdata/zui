import React from "react"
import {Tree} from "react-arborist"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {lakePoolPath} from "src/app/router/utils/paths"
import renamePool from "src/js/flows/renamePool"
import Tabs from "src/js/state/Tabs"
import {Empty} from "./empty"
import {FillFlexParent} from "./fill-flex-parent"
import PoolItem from "./pool-item"
import {useFilteredPools} from "./use-filtered-pools"

export function PoolsTree(props: {searchTerm: string}) {
  const dispatch = useDispatch()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const [pools, filteredPools] = useFilteredPools(props.searchTerm)
  console.log(poolId)
  if (pools.length === 0) {
    return (
      <Empty message="You have no pools yet. Create a pool by importing data." />
    )
  }
  if (filteredPools.length === 0) {
    return <Empty message="No pools match the search term." />
  }

  return (
    <FillFlexParent>
      {(dimens) => {
        return (
          <Tree
            disableDrop={true}
            indent={16}
            rowHeight={28}
            height={dimens.height}
            width={dimens.width}
            data={filteredPools}
            selection={poolId}
            selectionFollowsFocus
            onRename={(args: {id: string; name: string}) => {
              dispatch(renamePool(args.id, args.name))
            }}
            onSelect={(pools) => {
              if (pools.length === 1) {
                dispatch(Tabs.previewUrl(lakePoolPath(pools[0].id, lakeId)))
              }
            }}
            onPreview={(pool) => {
              dispatch(Tabs.previewUrl(lakePoolPath(pool.id, lakeId)))
            }}
            onActivate={(pool) => {
              dispatch(Tabs.activateUrl(lakePoolPath(pool.id, lakeId)))
            }}
          >
            {PoolItem}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}
