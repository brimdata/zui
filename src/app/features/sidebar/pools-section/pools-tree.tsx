import React from "react"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {lakePoolPath} from "src/app/router/utils/paths"
import renamePool from "src/js/flows/renamePool"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {Empty} from "./empty"
import {FillFlexParent} from "./fill-flex-parent"
import PoolItem from "./pool-item"

export function PoolsTree(props: {searchTerm: string}) {
  const dispatch = useDispatch()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const pools = useSelector(Current.getPools)
  if (pools.length === 0) {
    return (
      <Empty message="You have no pools yet. Create a pool by importing data." />
    )
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
            data={pools}
            searchTerm={props.searchTerm}
            searchMatch={(pool, term) => pool.name.toLowerCase().includes(term)}
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
