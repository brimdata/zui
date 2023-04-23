import {createCommand} from "src/core/command"
import {session} from "src/zui"

export const goBack = createCommand("session.goBack", () => {
  session.goBack()
})

export const goForward = createCommand("session.goForward", () => {
  session.goForward()
})
