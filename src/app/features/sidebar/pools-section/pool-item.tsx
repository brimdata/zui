import React from "react"
import {useSelector} from "react-redux"
import Icon from "src/app/core/icon-temp"
import {Pool} from "src/app/core/pools/pool"
import Ingests from "src/js/state/Ingests"
import {Item} from "../item"
import {NodeRendererProps} from "react-arborist"
import {poolContextMenu} from "src/app/menus/pool-context-menu"
import {updateFrom} from "src/app/commands/pins"
import {getDecendentLeaves, lastPart} from "./group-by-slash"

const PoolItem = ({node, tree, style, dragHandle}: NodeRendererProps<Pool>) => {
  const pool = node.data
  const ingest = useSelector(Ingests.get(pool.id))

  return (
    <Item
      innerRef={dragHandle}
      text={lastPart(pool.name)}
      inputValue={pool.name}
      isFolder={node.isInternal}
      onToggle={() => node.toggle()}
      icon={node.isInternal ? <Icon name="folder" /> : <Icon name="pool" />}
      state={node.state}
      innerStyle={style}
      onContextMenu={() => poolContextMenu.build(tree, node).show()}
      onSubmit={(name: string) => {
        if (node.isInternal) {
          const nodes = getDecendentLeaves(node)
          // @ts-ignore make the tree aware of the Folder type
          const prefix = node.data.prefix
          for (let child of nodes) {
            const newName = child.data.name.replace(prefix, name)
            child.submit(newName)
          }
        } else {
          node.submit(name)
          setTimeout(() => {
            tree.focus(pool.id)
          }, 100)
        }
      }}
      onReset={() => node.reset()}
      progress={ingest?.progress}
      onClick={(e) => {
        if (e.altKey) {
          e.stopPropagation()
          updateFrom.run(node.data.name)
        } else if (node.isLeaf) {
          node.isOnlySelection && node.edit()
        }
      }}
    />
  )
}

export default PoolItem
