import React from "react"
import {Tree} from "react-arborist"
import {useSelector} from "react-redux"
import {deletePools} from "src/app/commands/delete-pools"
import {useDispatch} from "src/app/core/state"
import useLakeId from "src/app/router/hooks/use-lake-id"
import usePoolId from "src/app/router/hooks/use-pool-id"
import {lakePoolPath} from "src/app/router/utils/paths"
import renamePool from "src/js/flows/renamePool"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {Empty} from "./empty"
import {FillFlexParent} from "src/components/fill-flex-parent"
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
            disableDrag
            disableDrop
            indent={16}
            rowHeight={28}
            padding={8}
            height={dimens.height}
            width={dimens.width}
            data={pools}
            searchTerm={props.searchTerm}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase())
            }
            selection={poolId}
            onRename={(args: {id: string; name: string}) => {
              dispatch(renamePool(args.id, args.name))
            }}
            onActivate={(node) => {
              dispatch(Tabs.previewUrl(lakePoolPath(node.id, lakeId)))
            }}
            onDelete={(args) => deletePools.run(args.ids)}
          >
            {PoolItem}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}
