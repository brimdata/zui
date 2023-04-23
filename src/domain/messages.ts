import {MenusMessages} from "./menus/messages"
import {PanesMessages} from "./panes/messages"
import {ResultsMessages} from "./results/messages"
import {SessionMessages} from "./session/messages"
import {WindowMessages} from "./window/messages"

// All ipc messages and handler args belong in here

export type Messages = ResultsMessages &
  MenusMessages &
  PanesMessages &
  WindowMessages &
  SessionMessages

export type MessageName = keyof Messages
