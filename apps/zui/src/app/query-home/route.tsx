import React, {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import Tab from "src/js/state/Tab"
import {useDispatch} from "../core/state"
import QueryHome from "./index"
import {loadRoute} from "./loader"

// If this is a nice pattern for routes,
// we could make it a generic component.

export function QueryRoute() {
  const location = useSelector(Current.getLocation)
  const lastKey = useSelector(Tab.getLastLocationKey)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (lastKey !== location.key) {
      dispatch(loadRoute(location))
    }
  }, [location.key, lastKey])

  return <QueryHome />
}
