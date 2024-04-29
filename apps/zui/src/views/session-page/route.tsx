import React, {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import {loadRoute} from "./loader"
import {SessionPage} from "."

// If this is a nice pattern for routes,
// we could make it a generic component.

export function SessionRoute() {
  const location = useSelector(Current.getLocation)
  const lastKey = useSelector(Tab.getLastLocationKey)
  useLayoutEffect(() => {
    if (lastKey !== location.key) {
      loadRoute(location)
    }
  }, [location.key, lastKey])

  return <SessionPage />
}
