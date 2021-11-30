import Tab from "src/js/state/Tab"

export function useExpandState() {
  const [defaultExpanded, setDefaultExpanded] = Tab.useState<boolean>(
    "results.view.objects.defaultExpanded",
    false
  )
  const [expanded, setExpanded] = Tab.useState(
    "results.view.objects.expanded",
    new Map()
  )

  return {
    expandAll() {
      setDefaultExpanded(true)
      setExpanded(new Map())
    },
    collapseAll() {
      setDefaultExpanded(false)
      setExpanded(new Map())
    },
    set: setExpanded,
    map: expanded,
    default: defaultExpanded
  }
}
