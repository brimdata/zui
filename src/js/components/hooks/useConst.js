/* @flow */

import {useLayoutEffect, useRef} from "react"

export default function useConst<T>(init: T, fn: () => T): T {
  let ref = useRef(init)

  useLayoutEffect(() => {
    ref.current = fn()
  }, [])

  return ref.current
}
