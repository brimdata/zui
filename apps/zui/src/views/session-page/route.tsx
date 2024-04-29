import React, {useLayoutEffect, useState} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import {loadRoute} from "./loader"
import {SessionPage} from "."
import {SessionPageHandler} from "./session-page-handler"
import {Active} from "src/models/active"

// If this is a nice pattern for routes,
// we could make it a generic component.

export function SessionRoute() {
  const location = useSelector(Current.getLocation)
  const lastKey = useSelector(Tab.getLastLocationKey)
  const [namedQuery, setNamedQuery] = useState(null)
  const [isModified, setIsModified] = useState(false)

  async function getProps() {
    const handler = new SessionPageHandler()
    const namedQuery = await handler.readQuery()

    setNamedQuery(namedQuery)
    setIsModified(!Active.session.snapshot.equals(namedQuery.snapshot))
  }

  useLayoutEffect(() => {
    if (lastKey !== location.key) {
      loadRoute(location)
      getProps()
    }
  }, [location.key, lastKey])

  return <SessionPage namedQuery={namedQuery} isModified={isModified} />
}
