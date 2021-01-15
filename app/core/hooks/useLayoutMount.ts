import {useLayoutEffect, useRef} from "react"

export default function useLayoutMount(fn: () => void) {
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      fn()
      first.current = false
    }
  }, [])
}
