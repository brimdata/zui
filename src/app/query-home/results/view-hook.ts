import useKeybinding from "src/app/core/hooks/use-keybinding"
import {useDispatch, useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {ResultsView} from "src/js/state/Layout/types"

const INSPECTOR = "INSPECTOR"
const TABLE = "TABLE"

export function useResultsView() {
  const dispatch = useDispatch()
  const view = useSelector(Layout.getResultsView)

  const setView = (view: ResultsView) => {
    dispatch(Layout.setResultsView(view as ResultsView))
  }

  useKeybinding("ctrl+d", () => {
    setView(view === TABLE ? INSPECTOR : TABLE)
  })

  return {
    isTable: view === TABLE,
    isInspector: view === INSPECTOR,
    setTable: () => setView(TABLE),
    setInspector: () => setView(INSPECTOR),
  }
}
