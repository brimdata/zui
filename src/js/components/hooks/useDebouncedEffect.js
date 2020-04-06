/* @flow */
import {useEffect, useRef} from "react"

export default function useDebouncedEffect(
  fn: Function,
  ms: number,
  deps: ?(*[])
) {
  let t = useRef()

  useEffect(() => {
    clearTimeout(t.current)
    t.current = setTimeout(fn, ms)
  }, deps)

  useEffect(() => {
    return () => clearTimeout(t.current)
  }, [])
}
