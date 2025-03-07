import React from "react"
import {useSelector} from "react-redux"
import {Icon} from "src/components/icon"
import {Pool} from "src/models/pool"
import Loads from "src/js/state/Loads"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {poolContextMenu} from "src/app/menus/pool-context-menu"
import Config from "src/js/state/Config"
import {PoolName} from "./pool-name"
import {State} from "src/js/state/types"
import {showMenu} from "src/core/menu"
import {setFromPin} from "src/domain/session/handlers"
import {useAfterDelayOf} from "src/util/hooks/use-after-delay-of"

const PoolItem = ({node, tree, style, dragHandle}: NodeRendererProps<Pool>) => {
  const pool = node.data
  const progress = useSelector((state: State) =>
    Loads.getPoolProgress(state, pool.id)
  )
  const afterDelayOf = useAfterDelayOf()
  const delimiter = useSelector(Config.getPoolNameDelimiter)
  const poolName = new PoolName(pool.name, delimiter)

  return (
    <Item
      innerRef={dragHandle}
      text={node.isInternal ? poolName.name : poolName.basename}
      inputValue={pool.name}
      isFolder={node.isInternal}
      icon={node.isInternal ? <Icon name="folder" /> : <Icon name="pool" />}
      state={node.state}
      innerStyle={style}
      onContextMenu={() => showMenu(poolContextMenu(tree, node))}
      onSubmit={(name: string) => node.submit(name)}
      onReset={() => node.reset()}
      onToggle={() => node.toggle()}
      progress={progress}
      onClick={(e) => {
        if (e.altKey) {
          e.stopPropagation()
          setFromPin(node.data.name)
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
