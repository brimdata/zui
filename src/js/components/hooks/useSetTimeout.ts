import {useEffect, useRef} from "react"

export default function useSetTimeout() {
  let timers = useRef([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (fn: Function, ms: number) => {
    let id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }
}
