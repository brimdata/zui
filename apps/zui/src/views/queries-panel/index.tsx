import {useEffect, useState} from "react"
import {TreeModel, TreeView} from "react-arborist-v4"
import {Icon} from "src/components/icon"
import {IconButton} from "src/components/icon-button"
import {invoke} from "src/core/invoke"
import useResizeObserver from "use-resize-observer"
import {ItemController} from "./item-controller"
import {WorkspacesController} from "./workspaces-controller"
import Current from "src/js/state/Current"
import {useSelector} from "react-redux"
import {Workspace} from "src/models/workspace"
import Window from "src/js/state/Window"

export function QueriesPanel() {
  const workspaceId = useSelector(Window.getWorkspaceId)

  async function refresh() {
    if (workspaceId) {
      const workspace = Workspace.find(workspaceId)
      setData(await invoke("workspaceFiles.contents", workspace.attrs.path))
    }
  }

  useEffect(() => {
    refresh()
  }, [workspaceId])

  const {ref, width, height} = useResizeObserver()

  const [data, setData] = useState([])
  const tree = new TreeModel(data, {
    id: (d) => d.path,
    isLeaf: (d) => !d.isDir,
    sortBy: [(d) => d.isDir, (d) => d.name],
    sortOrder: ["desc", "asc"],
  })

  const [opens, setOpens] = useState({})

  return (
    <>
      <WorkspacePicker />
      <section className="grow min-h-0" ref={ref}>
        <TreeView
          padding={3}
          nodes={{
            value: tree.nodes,
            initialize: tree.initialize,
            onChange: (e) => {
              // @ts-ignore
              tree[e.type](e)
              setData([...tree.sourceData])
            },
          }}
          opens={{
            value: opens,
            onChange: async (e) => {
              for (const id of e.ids) {
                const node = tree.find(id)
                const files = await invoke(
                  "workspaceFiles.contents",
                  node.sourceData.path
                )
                node.setChildren(files)
                setData([...tree.sourceData])
              }
              setOpens(e.value)
            },
          }}
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
  const workspace = attrs ? new Workspace(attrs) : null
  const name = workspace ? workspace.name : "(No Workspace Selected)"
  return (
    <nav className="workspace-picker repel">
      <label>{name}</label>{" "}
      <IconButton
        iconName="chevron_down"
        onClick={() => workspaces.showMenu()}
      />
    </nav>
  )
}
