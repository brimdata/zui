import useKeybinding from "app/core/hooks/use-keybinding"
import {useState} from "react"

const OBJECTS = "objects"
const TABLE = "table"

export function useResultsView() {
  // This belongs in a reducers
  const [view, setView] = useState(OBJECTS)

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
