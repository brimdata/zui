import React from "react"
import {useSelector} from "react-redux"
import Icon from "src/app/core/icon-temp"
import {Pool} from "src/app/core/pools/pool"
import Ingests from "src/js/state/Ingests"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {poolContextMenu} from "src/app/menus/pool-context-menu"
import {updateFrom} from "src/app/commands/pins"

const PoolItem = ({node, tree, style, dragHandle}: NodeRendererProps<Pool>) => {
  const pool = node.data
  const ingest = useSelector(Ingests.get(pool.id))

  return (
    <Item
      innerRef={dragHandle}
      text={pool.name}
      icon={<Icon name="pool" />}
      state={node.state}
      innerStyle={style}
      onContextMenu={() => poolContextMenu.build(tree, node).show()}
      onSubmit={(name: string) => node.submit(name)}
      progress={ingest?.progress}
      onClick={(e) => {
        if (e.altKey) {
          e.stopPropagation()
          updateFrom.run(node.data.name)
        } else {
          node.isOnlySelection && node.edit()
        }
      }}
    />
  )
}

export default PoolItem
