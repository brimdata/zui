import {useEffect} from "react"
import {TreeView} from "react-arborist-v4"
import useResizeObserver from "use-resize-observer"
import {useWorkspaceEntriesState} from "./state"
import {WorkspaceEntriesHandler} from "./handler"
import {Icon} from "src/components/icon"

export type Props = {
  id: string
}

export function WorkspaceEntries(props: Props) {
  const state = useWorkspaceEntriesState()
  const handler = new WorkspaceEntriesHandler(props, state)
  const {ref, width, height} = useResizeObserver()

  useEffect(() => {
    handler.refresh()
  }, [props.id])

  return (
    <section aria-label="Workspace Entries" className="grow min-h-0" ref={ref}>
      <TreeView
        width={width}
        height={height}
        indent={24}
        padding={3}
        openByDefault={false}
        className="sidebar-tree"
        rowClassName="sidebar-row gutter"
        renderNode={(props) => <NodeRenderer {...props} handler={handler} />}
        nodes={{
          value: handler.tree.nodes,
          initialize: handler.tree.initialize,
          onChange: (e) => handler.onNodesChange(e),
        }}
        opens={{
          value: handler.state.opens,
          onChange: (e) => handler.onOpensChange(e),
        }}
      />
    </section>
  )
}

function NodeRenderer(props) {
  if (props.node.isLeaf) {
    return <EntryItem {...props} />
  } else {
    return <FolderItem {...props} />
  }
}

function EntryItem({attrs, node, handler}) {
  return (
    <div
      {...attrs}
      onClick={() => handler.onClick(node)}
      className="sidebar-node h-full v-center gap-2xs "
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
