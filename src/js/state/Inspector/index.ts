import activeTabSelect from "../Tab/activeTabSelect"
import {actions} from "./reducer"

export default {
  getExpanded: activeTabSelect((t) => t.inspector.expanded),
  getExpandedDefault: activeTabSelect((t) => t.inspector.expandedDefault),
  getPages: activeTabSelect((t) => t.inspector.pages),
  getScrollPosition: activeTabSelect((t) => t.inspector.scrollPosition),
  ...actions,
}
