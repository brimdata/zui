import {useEffect, useRef} from "react"

export function useTimeout() {
  const timeoutId = useRef<number>(0)
  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])
  return (fn: () => void, ms: number) => {
    timeoutId.current = setTimeout(fn, ms)
  }
}
