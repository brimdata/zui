import {useEffect} from "react"
import {NodeApi} from "react-arborist"
import {TreeView, useNodes} from "react-arborist-v4"
import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {invoke} from "src/core/invoke"
import useResizeObserver from "use-resize-observer"
import {ItemController} from "./item-controller"

export function QueriesPanel() {
  const nodes = useNodes([], {
    id: (d) => d.path,
    isLeaf: (d) => !d.isDir,
    sortBy: [(d) => d.isDir, (d) => d.name],
    sortOrder: ["desc", "asc"],
  })

  async function refresh() {
    nodes.setSourceData(await invoke("workspaceFiles.index"))
  }

  useEffect(() => {
    refresh()
  }, [])

  const {ref, width, height} = useResizeObserver()

  return (
    <div>
      <select></select>
      <section className="grow min-h-0" ref={ref}>
        <TreeView
          nodes={nodes}
          openByDefault={false}
          width={width}
          height={height}
          renderNode={NodeRenderer}
          indent={24}
          className="sidebar-tree"
          rowClassName="sidebar-row gutter"
        />
      </section>
    </div>
  )
}

function NodeRenderer(props) {
  if (props.node.isLeaf) {
    return <QueryItem {...props} />
  } else {
    return <FolderItem {...props} />
  }
}

function QueryItem({attrs, node}) {
  const ctl = new ItemController()
  return (
    <div
      {...attrs}
      onClick={() => ctl.runQuery(node)}
      className="sidebar-node h-full v-center gap-2xs"
    >
      <Icon name="query" /> {node.data.name}
    </div>
  )
}

function FolderItem({attrs, node}) {
  return (
    <div
      {...attrs}
      onClick={() => node.toggle()}
      className="sidebar-node h-full v-center gap-2xs"
    >
      <Icon name="folder" /> {node.data.name}
    </div>
  )
}
