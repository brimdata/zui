import {MenusHandlers} from "./menus/messages"
import {PanesHandlers} from "./panes/messages"
import {PoolsOperations} from "./pools/messages"
import {ResultsHandlers, ResultsOperations} from "./results/messages"
import {SessionHandlers} from "./session/messages"
import {WindowHandlers, WindowOperations} from "./window/messages"
import {LegacyOperations} from "./legacy-ops/messages"
import {E2EOperations} from "./e2e/messages"
import {EnvOperations} from "./env/messages"
import {LoadersOperations} from "./loaders/messages"

export type Messages = ResultsHandlers &
  MenusHandlers &
  PanesHandlers &
  WindowHandlers &
  SessionHandlers

export type Operations = PoolsOperations &
  LegacyOperations &
  E2EOperations &
  ResultsOperations &
  EnvOperations &
  LoadersOperations &
  WindowOperations

export type OperationName = keyof Operations
export type MessageName = keyof Messages
