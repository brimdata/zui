import {useEffect, useLayoutEffect, useState} from "react"
import {MenuItem} from "src/core/menu"
import {invoke} from "../invoke"
import {useTabId} from "src/util/hooks/use-tab-id"
import {evaluate} from "when-clause"

export function useMenuExtension(
  name: string,
  menuItems: MenuItem[],
  whenContext: object
) {
  const [items, setItems] = useState(menuItems)
  const tabId = useTabId()

  useLayoutEffect(() => {
    invoke("menus.extend", name, menuItems).then((items) => setItems(items))
  }, [name, tabId])

  useEffect(() => {
    return global.zui.on("menus.update", (e, menu, id, update) => {
      if (menu !== name) return
      setItems((items) =>
        items.map((item: MenuItem) => {
          return item.id === id ? {...item, ...update} : item
        })
      )
    })
  }, [name])

  return compileMenuItems(items, whenContext)
}

function compileMenuItems(items: MenuItem[], context: Record<string, any>) {
  return items
    .map<MenuItem>((item) => {
      return {
        ...item,
        whenResult: item.when && evaluate(item.when, context),
        priority: item.priority ?? 0,
      }
    })
    .sort((a, b) => {
      if (a.priority > b.priority) return -1
      if (a.priority < b.priority) return 1
      return 0
    })
}
