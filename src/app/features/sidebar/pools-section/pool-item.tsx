import React from "react"
import {useSelector} from "react-redux"
import Icon from "src/app/core/icon-temp"
import {Pool} from "src/app/core/pools/pool"
import Loads from "src/js/state/Loads"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {poolContextMenu} from "src/app/menus/pool-context-menu"
import {updateFrom} from "src/app/commands/pins"
import {useAfterDelayOf} from "src/app/core/hooks/use-after-delay-of"
import Config from "src/js/state/Config"
import {PoolName} from "./pool-name"

const PoolItem = ({node, tree, style, dragHandle}: NodeRendererProps<Pool>) => {
  const pool = node.data
  const progress = useSelector((state) => Loads.getPoolProgress(state, pool.id))
  const afterDelayOf = useAfterDelayOf()
  const delimeter = useSelector(Config.getPoolNameDelimeter)
  const poolName = new PoolName(pool.name, delimeter)

  return (
    <Item
      innerRef={dragHandle}
      text={node.isInternal ? poolName.name : poolName.basename}
      inputValue={pool.name}
      isFolder={node.isInternal}
      icon={node.isInternal ? <Icon name="folder" /> : <Icon name="pool" />}
      state={node.state}
      innerStyle={style}
      onContextMenu={() => poolContextMenu.build(tree, node).show()}
      onSubmit={(name: string) => node.submit(name)}
      onReset={() => node.reset()}
      onToggle={() => node.toggle()}
      progress={progress}
      onClick={(e) => {
        if (e.altKey) {
          e.stopPropagation()
          updateFrom.run(node.data.name)
        } else {
          afterDelayOf(480, () => {
            node.isOnlySelection && node.edit()
          })
        }
      }}
    />
  )
}

export default PoolItem
