import activeTabSelect from "../Tab/activeTabSelect"
import {actions} from "./reducer"

export default {
  getExpanded: activeTabSelect((t) => t.inspector.expanded),
  getDefaultExpanded: activeTabSelect((t) => t.inspector.defaultExpanded),
  getScrollPosition: activeTabSelect((t) => t.inspector.scrollPosition),
  ...actions,
}
