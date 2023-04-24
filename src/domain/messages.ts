import {MenusHandlers} from "./menus/messages"
import {PanesHandlers} from "./panes/messages"
import {PoolsOperations} from "./pools/messages"
import {ResultsHandlers} from "./results/messages"
import {SessionHandlers} from "./session/messages"
import {WindowHandlers} from "./window/messages"
import {LegacyOperations} from "./legacy-ops/messages"

// All ipc messages and args belong in here

export type Messages = ResultsHandlers &
  MenusHandlers &
  PanesHandlers &
  WindowHandlers &
  SessionHandlers

export type Operations = PoolsOperations & LegacyOperations

export type OperationName = keyof Operations

export type MessageName = keyof Messages
