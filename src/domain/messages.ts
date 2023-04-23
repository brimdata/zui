import {MenusMessages} from "./menus/messages"
import {PanesMessages} from "./panes/messages"
import {ResultsMessages} from "./results/messages"
import {WindowMessages} from "./window/messages"

// All ipc messages and handler args belong in here

export type Messages = ResultsMessages &
  MenusMessages &
  PanesMessages &
  WindowMessages

export type MessageName = keyof Messages
