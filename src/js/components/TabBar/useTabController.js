/* @flow */
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useRef, useState} from "react"
import onIdle from "on-idle"

import Tabs from "../../state/Tabs"

export default function(count: number, calcWidths: Function) {
  let trueActiveId = useSelector(Tabs.getActive)
  let [activeId, setActive] = useState(trueActiveId)
  let removedByClick = useRef(false)
  let dispatch = useDispatch()

  useEffect(() => {
    if (!removedByClick.current) calcWidths()
  }, [count])

  useEffect(() => {
    setActive(trueActiveId)
  }, [trueActiveId])

  return {
    activeId,

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
    },

    onTabMove(indices: number[]) {
      dispatch(Tabs.order(indices))
    }
  }
}
