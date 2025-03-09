import {Scrollable} from "src/components/scrollable"
import {ColumnsToolbar} from "./columns-toolbar"
import {ColumnsTree} from "./columns-tree"

export function ColumnsPane() {
  return (
    <div className="stack h-full overflow-hidden">
      <ColumnsToolbar />
      <Scrollable>
        <ColumnsTree />
      </Scrollable>
    </div>
  )
}
