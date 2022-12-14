import {useRef} from "react"

export function useRefCheck(value) {
  const prev = useRef<any>(value)
  if (value !== prev.current) {
    prev.current = value
  }
}
