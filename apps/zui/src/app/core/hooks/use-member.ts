import {useRef} from "react"

export function useMember<T>(defaultValue: T) {
  const ref = useRef(defaultValue)
  const member = () => ref.current
  const setMember = (v: T) => {
    ref.current = v
  }
  return [member, setMember] as const
}
