import React, {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {useDispatch} from "../core/state"
import QueryHome from "./index"
import {loadRoute} from "./loader"

// If this is a nice pattern for routes,
// we could make it a generic component.

export function QueryRoute() {
  const location = useSelector(Current.getLocation)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(loadRoute(location))
  }, [location.key])

  return <QueryHome />
}
