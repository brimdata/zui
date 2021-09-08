import React, {ReactElement} from "react"
import {useSelector} from "react-redux"
import Tabs from "src/js/state/Tabs"
import TabsRouter from "./tabs-router"

export default function AppTabsRouter({children}: {children: ReactElement}) {
  const tabId = useSelector(Tabs.getActive)
  return (
    <TabsRouter tabId={tabId} histories={global.tabHistories}>
      {children}
    </TabsRouter>
  )
}
