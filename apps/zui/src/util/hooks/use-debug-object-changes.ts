import {useRef} from "react"

export function useDebugObjectChanges(object: object, label?: string) {
  const ref = useRef<any>()
  if (ref.current !== object && ref.current) {
    console.group("Debug Object Changes " + label)
    for (let key in ref.current) {
      if (ref.current[key] !== object[key]) {
        console.log(
          key,
          "changed: ",
          "from",
          ref.current[key],
          "to",
          object[key]
        )
      }
    }
    console.groupEnd()
  }
  ref.current = object
}
