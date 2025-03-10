import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Tabs from "src/js/state/Tabs"
import TabsRouter from "./tabs-router"
import Url from "src/js/state/Url"

export default function AppTabsRouter({children}) {
  const dispatch = useDispatch()

  const listen = (_location) => {
    dispatch(Url.changed())
  }

  const tabId = useSelector(Tabs.getActive)
  return (
    <TabsRouter listen={listen} tabId={tabId} histories={global.tabHistories}>
      {children}
    </TabsRouter>
  )
}
