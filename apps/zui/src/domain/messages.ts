import {MenusHandlers} from "./menus/messages"
import {PanesHandlers} from "./panes/messages"
import {PoolsHandlers, PoolsOperations} from "./pools/messages"
import {ResultsHandlers, ResultsOperations} from "./results/messages"
import {SessionHandlers} from "./session/messages"
import {WindowHandlers, WindowOperations} from "./window/messages"
import {LegacyOperations} from "./legacy-ops/messages"
import {E2EOperations} from "./e2e/messages"
import {EnvOperations} from "./env/messages"
import {LoadersHandlers, LoadersOperations} from "./loaders/messages"

export type Handlers = ResultsHandlers &
  MenusHandlers &
  PanesHandlers &
  WindowHandlers &
  SessionHandlers &
  LoadersHandlers &
  PoolsHandlers

export type Operations = PoolsOperations &
  LegacyOperations &
  E2EOperations &
  ResultsOperations &
  EnvOperations &
  LoadersOperations &
  WindowOperations

export type OperationName = keyof Operations
export type HandlerName = keyof Handlers
