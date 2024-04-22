import {useEffect} from "react"
import {TreeView, useNodes} from "react-arborist-v4"
import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {invoke} from "src/core/invoke"
import useResizeObserver from "use-resize-observer"
import {ItemController} from "./item-controller"
import {WorkspacesController} from "./workspaces-controller"
import Current from "src/js/state/Current"
import {useSelector} from "react-redux"
import {Workspace} from "src/models/workspace"
import {Active} from "src/models/active"
import Window from "src/js/state/Window"

export function QueriesPanel() {
  const nodes = useNodes([], {
    id: (d) => d.path,
    isLeaf: (d) => !d.isDir,
    sortBy: [(d) => d.isDir, (d) => d.name],
    sortOrder: ["desc", "asc"],
  })
  const workspaceId = useSelector(Window.getWorkspaceId)

  async function refresh() {
    nodes.setSourceData(await invoke("workspaceFiles.index", workspaceId))
  }

  useEffect(() => {
    refresh()
  }, [workspaceId])

  const {ref, width, height} = useResizeObserver()
  return (
    <>
      <WorkspacePicker />
      <section className="grow min-h-0" ref={ref}>
        <TreeView
          padding={3}
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
    </>
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

function WorkspacePicker() {
  const workspaces = new WorkspacesController()
  const attrs = useSelector(Current.getWorkspace)
  const workspace = new Workspace(attrs ? attrs : Workspace.defaultAttrs)
  return (
    <nav className="workspace-picker repel">
      <label>{workspace.name}</label>{" "}
      <IconButton
        iconName="chevron_down"
        onClick={(e) => workspaces.showMenu()}
      />
    </nav>
  )
}
