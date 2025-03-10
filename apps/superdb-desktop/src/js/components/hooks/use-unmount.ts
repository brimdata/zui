import {useEffect} from "react"

export function useUnmount(callback: () => any) {
  useEffect(() => {
    return () => {
      callback()
    }
  }, [])
}
