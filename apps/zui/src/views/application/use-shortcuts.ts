import {useEffect} from "react"
import Mousetrap from "mousetrap"

import Modal from "../../js/state/Modal"
import Tabs from "../../js/state/Tabs"
import {useDispatch} from "src/core/use-dispatch"
import cmd from "src/cmd"
import {QuerySession} from "src/models/query-session"

export default function () {
  const dispatch = useDispatch()
  useEffect(() => {
    const el = document.documentElement
    if (!el) throw new Error("No Document Element")
    const bindings = new Mousetrap(el)
      .bind("mod+t", () => QuerySession.createWithTab())
      .bind("mod+w", (e) => {
        e.preventDefault()
        cmd.tabs.closeActive()
      })
      .bind("ctrl+tab", () => dispatch(Tabs.activateNext()))
      .bind("ctrl+shift+tab", () => dispatch(Tabs.activatePrev()))
    for (let i = 0; i < 8; ++i) {
      bindings.bind(`mod+${i + 1}`, () => dispatch(Tabs.activateByIndex(i)))
    }
    bindings
      .bind("mod+9", () => dispatch(Tabs.activateLast()))
      .bind("mod+,", () => dispatch(Modal.show("settings")))

    return () => {
      bindings.reset()
    }
  }, [])
}
