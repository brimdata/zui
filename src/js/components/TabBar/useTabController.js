/* @flow */
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useRef, useState} from "react"
import onIdle from "on-idle"

import Tabs from "../../state/tabs"

export default function(count: number, calcWidths: Function) {
  let activeId = useSelector(Tabs.getActive)
  let [active, setActive] = useState(activeId)
  let removedByClick = useRef(false)
  let dispatch = useDispatch()

  useEffect(() => {
    if (!removedByClick.current) calcWidths()
  }, [count])

  useEffect(() => {
    setActive(activeId)
  }, [activeId])

  return {
    active,

    onAddClick() {
      dispatch(Tabs.new())
    },

    onRemoveClick(event: MouseEvent, id: string) {
      event.stopPropagation()
      removedByClick.current = true
      dispatch(Tabs.remove(id))
    },

    onTabClick(id: string) {
      setActive(id)
      onIdle(() => dispatch(Tabs.activate(id)))
    },

    onMouseLeave() {
      if (removedByClick.current) {
        calcWidths()
        removedByClick.current = false
      }
    }
  }
}
