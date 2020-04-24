/* @flow */
import {useEffect, useState} from "react"

export default function useDoubleClick(
  singleFunc: Function,
  doubleFunc: Function
) {
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    let singleClickTimer
    if (clicks === 1) {
      singleClickTimer = setTimeout(function() {
        singleFunc()
        setClicks(0)
      }, 250)
    } else if (clicks === 2) {
      doubleFunc()
      setClicks(0)
    }
    return () => clearTimeout(singleClickTimer)
  }, [clicks])

  return () => {
    setClicks((clicks) => clicks + 1)
  }
}
