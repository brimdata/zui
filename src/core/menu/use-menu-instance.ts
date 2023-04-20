import {useEffect, useMemo} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import ResultsToolbarMenu from "src/js/state/ResultsToolbar"
import {BuiltMenu, MenuItem} from "src/core/menu"
import {getMenuTemplate} from "src/js/electron/ops"

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

  useEffect(() => {
    getMenuTemplate(name).then((items) => dispatch(setMenu(name, items)))
  }, [])
  console.log(items)

  return useMemo(() => new BuiltMenu({id: name}, items), [items])
}
