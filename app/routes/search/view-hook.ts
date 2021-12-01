import {useBrimApi} from "app/core/context"
import useKeybinding from "app/core/hooks/use-keybinding"
import {useEffect} from "react"
import {useSelector, useStore} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import Viewer from "src/js/state/Viewer"

const OBJECTS = "objects"
const TABLE = "table"

export function useResultsView() {
  const location = useSelector(Current.getLocation)
  const shapes = useSelector(Viewer.getShapes)
  const status = useSelector(Viewer.getStatus)
  const store = useStore()
  const api = useBrimApi()

  const [view, setView] = Tab.useState<"table" | "objects">(
    "results.view",
    TABLE
  )

  useKeybinding("ctrl+d", () => {
    setView(view === TABLE ? OBJECTS : TABLE)
  })

  useEffect(
    () =>
      api.searches.onDidFinish(({firstPage}) => {
        if (firstPage) {
          const shapes = Viewer.getShapes(store.getState())
          if (Object.keys(shapes).length > 1) {
            setView(OBJECTS)
          } else {
            setView(TABLE)
          }
        }
      }),
    []
  )

  return {
    isTable: view === TABLE,
    isObjects: view === OBJECTS,
    setTable: () => setView(TABLE),
    setObjects: () => setView(OBJECTS)
  }
}
