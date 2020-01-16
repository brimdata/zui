/* @flow */

import {useEffect, useRef} from "react"

export default function usePref(prop: *) {
  let prev = useRef(prop)
  let next = useRef(prop)

  useEffect(() => {
    prev.current = next.current
    next.current = prop
  }, [prop])

  return prev.current
}
