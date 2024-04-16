import {useEffect} from "react"
import {TreeView, useNodes} from "react-arborist-v4"
import {invoke} from "src/core/invoke"

export function QueriesPanel() {
  const nodes = useNodes([], {
    id: (d) => d.name,
  })

  async function refresh() {
    const entries = await invoke("workspaceFiles.index")
    nodes.setSourceData(entries)
  }

  useEffect(() => {
    refresh()
  }, [])

  return <TreeView nodes={nodes} />
}
