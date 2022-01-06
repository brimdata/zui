import {useBrimApi} from "app/core/context"
import useKeybinding from "app/core/hooks/use-keybinding"
import {useTabId} from "app/core/hooks/use-tab-id"
import {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {ResultsView} from "src/js/state/Layout/types"

const INSPECTOR = "INSPECTOR"
const TABLE = "TABLE"

export function useResultsView() {
  const dispatch = useDispatch()
  const api = useBrimApi()
  const currentTabId = useTabId()
  const view = useSelector(Layout.getResultsView)

  const setView = (view: ResultsView) => {
    dispatch(Layout.setResultsView(view as ResultsView))
  }

  useKeybinding("ctrl+d", () => {
    setView(view === TABLE ? INSPECTOR : TABLE)
  })

  useLayoutEffect(() => {
    return api.searches.onDidFinish(({id, status, tabId, shapes, initial}) => {
      if (id !== "Table") return
      if (tabId !== currentTabId) return
      if (status !== "SUCCESS") return
      if (!initial) return
      setView(shapes.length > 1 ? INSPECTOR : TABLE)
    })
  }, [currentTabId])

  return {
    isTable: view === TABLE,
    isInspector: view === INSPECTOR,
    setTable: () => setView(TABLE),
    setInspector: () => setView(INSPECTOR)
  }
}
