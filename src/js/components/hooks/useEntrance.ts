import {useEffect, useRef, useState} from "react"

export default function useEntrance(
  show: boolean,
  enterDelay: number,
  exitDelay: number
) {
  const [status, setStatus] = useState<"in" | "out" | "exiting" | "entering">(
    "out"
  )
  const outTimer = useRef(null)
  const inTimer = useRef(null)

  useEffect(() => {
    if (show) {
      clearTimeout(outTimer.current)
      inTimer.current = setTimeout(() => setStatus("entering"), enterDelay)
    } else {
      clearTimeout(inTimer.current)
      outTimer.current = setTimeout(() => setStatus("exiting"), exitDelay)
    }
  }, [show])

  const entered = () => setStatus("in")
  const exitted = () => setStatus("out")

  return [status, entered, exitted]
}
