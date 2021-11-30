import {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import Tab from "src/js/state/Tab"
import Viewer from "src/js/state/Viewer"

const OBJECTS = "objects"
const TABLE = "table"

export function useResultsView() {
  const shapes = useSelector(Viewer.getShapes)

  const [view, setView] = Tab.useState<"table" | "objects">(
    "results.view",
    TABLE
  )

  useLayoutEffect(() => {
    if (Object.keys(shapes).length > 1) {
      setView(OBJECTS)
    } else {
      setView(TABLE)
    }
  }, [shapes])

  return {
    isTable: view === TABLE,
    isObjects: view === OBJECTS,
    setTable: () => setView(TABLE),
    setObjects: () => setView(OBJECTS)
  }
}
