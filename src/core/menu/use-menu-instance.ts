import {useEffect, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import ResultsToolbarMenu from "src/js/state/ResultsToolbar"
import {BuiltMenu, MenuItem} from "src/core/menu"
import {createSelector} from "@reduxjs/toolkit"
import Layout from "src/js/state/Layout"
import {compile} from "../when/compile"
import {invoke} from "../invoke"

/**
 * 1. get the items from redux
 * 2. get the template from main
 * 3. set redux to match the template
 * 4. return a new build menu with the items from redux
 */

function setMenu(name: string, items: MenuItem[]) {
  switch (name) {
    case "results.toolbarMenu":
      return ResultsToolbarMenu.set(items)
  }
}

export function useMenuInstance(name: string) {
  const dispatch = useDispatch()
  const items = useSelector(ResultsToolbarMenu.get)
  const whenContext = useSelector(getWhenContext)

  useEffect(() => {
    invoke("getMenuTemplateOp", name).then((template) => {
      const items = compileMenuItems(template, whenContext)
      dispatch(setMenu(name, items))
    })
  }, [whenContext])

  return useMemo(() => new BuiltMenu({id: name}, items), [items])
}

const getWhenContext = createSelector(Layout.getResultsView, (resultsView) => {
  return {
    "results.view": resultsView.toLowerCase(),
  }
})

function compileMenuItems(items: MenuItem[], context: Record<string, any>) {
  return items
    .map<MenuItem>((item) => {
      return {
        ...item,
        whenResult: compile(item.when, context),
        priority: item.priority ?? 0,
      }
    })
    .sort((a, b) => {
      if (a.priority > b.priority) return -1
      if (a.priority < b.priority) return 1
      return 0
    })
}
