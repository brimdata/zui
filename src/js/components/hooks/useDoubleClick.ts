import {useEffect, useState} from "react"

export default function useDoubleClick(
  singleFunc: Function,
  doubleFunc: Function
) {
  const [clicks, setClicks] = useState(0)
  const [event, setEvent] = useState(undefined)

  const resetState = () => {
    setClicks(0)
    setEvent(undefined)
  }
  useEffect(() => {
    let singleClickTimer
    if (clicks === 1) {
      singleClickTimer = setTimeout(function() {
        singleFunc(event)
        resetState()
      }, 250)
    } else if (clicks === 2) {
      doubleFunc(event)
      resetState()
    }
    return () => clearTimeout(singleClickTimer)
  }, [clicks])

  return (e: React.SyntheticEvent<HTMLElement>) => {
    e.persist()
    setEvent(e)
    setClicks((clicks) => clicks + 1)
  }
}
