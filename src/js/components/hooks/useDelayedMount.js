/* @flow */
import {useEffect, useRef, useState} from "react"

export default function useDelayedMount(show: boolean, delay: number) {
  let [ready, setReady] = useState(false)
  let id = useRef()

  useEffect(() => {
    if (show) {
      id.current = setTimeout(() => setReady(true), delay)
    } else {
      clearTimeout(id.current)
      setReady(false)
    }
  }, [show])

  return ready
}
