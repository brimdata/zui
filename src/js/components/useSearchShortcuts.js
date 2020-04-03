/* @flow */

import {useDispatch} from "react-redux"
import {useEffect} from "react"
import Mousetrap from "mousetrap"

import Tabs from "../state/Tabs"
import {adjustSelectedLogIndex} from "../flows/adjustSelectedLogIndex"

export default function() {
  let dispatch = useDispatch()
  useEffect(() => {
    Mousetrap.bind("down", (e) => {
      e.preventDefault()
      dispatch(adjustSelectedLogIndex(1))
    })
    Mousetrap.bind("up", (e) => {
      e.preventDefault()
      dispatch(adjustSelectedLogIndex(-1))
    })
    Mousetrap.bind("mod+t", () => dispatch(Tabs.new()))
    Mousetrap.bind("mod+w", () => dispatch(Tabs.closeActive()))
    Mousetrap.bind("ctrl+tab", () => dispatch(Tabs.activateNext()))
    Mousetrap.bind("ctrl+shift+tab", () => dispatch(Tabs.activatePrev()))
    for (let i = 0; i < 8; ++i) {
      Mousetrap.bind(`mod+${i + 1}`, () => dispatch(Tabs.activateByIndex(i)))
    }
    Mousetrap.bind("mod+9", () => dispatch(Tabs.activateLast()))

    return () => Mousetrap.reset()
  }, [])
}
