import {useEffect, useLayoutEffect, useState} from "react"
import {MenuItem} from "src/core/menu"
import {compile} from "../when/compile"
import {invoke} from "../invoke"
import {useTabId} from "src/app/core/hooks/use-tab-id"

export function useMenuExtension(
  name: string,
  menuItems: MenuItem[],
  whenContext: object
) {
  const [items, setItems] = useState(menuItems)
  const tabId = useTabId()

  useLayoutEffect(() => {
    invoke("menus.extend", name, menuItems)
      .then((extended) => compileMenuItems(extended, whenContext))
      .then((compiled) => setItems(compiled))
  }, [name, menuItems, whenContext, tabId])

  useEffect(() => {
    return global.zui.on("menus.update", (e, menu, id, update) => {
      if (menu !== name) return
      setItems(
        items.map((item: MenuItem) => {
          return item.id === id ? {...item, ...update} : item
        })
      )
    })
  }, [items, name])

  return items
}

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
