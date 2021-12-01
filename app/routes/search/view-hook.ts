import useKeybinding from "app/core/hooks/use-keybinding"
import {useLayoutEffect, useRef} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import Viewer from "src/js/state/Viewer"

const OBJECTS = "objects"
const TABLE = "table"

export function useResultsView() {
  const location = useSelector(Current.getLocation)
  const shapes = useSelector(Viewer.getShapes)
  const status = useSelector(Viewer.getStatus)

  const [view, setView] = Tab.useState<"table" | "objects">(
    "results.view",
    TABLE
  )

  useKeybinding("ctrl+d", () => {
    setView(view === TABLE ? OBJECTS : TABLE)
  })

  return {
    isTable: view === TABLE,
    isObjects: view === OBJECTS,
    setTable: () => setView(TABLE),
    setObjects: () => setView(OBJECTS)
  }
}
