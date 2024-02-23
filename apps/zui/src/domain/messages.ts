import {MenusHandlers, MenusOperations} from "./menus/messages"
import {PanesHandlers} from "./panes/messages"
import {PoolsHandlers, PoolsOperations} from "./pools/messages"
import {ResultsHandlers, ResultsOperations} from "./results/messages"
import {SessionHandlers} from "./session/messages"
import {WindowHandlers, WindowOperations} from "./window/messages"
import {LegacyOperations} from "./legacy-ops/messages"
import {E2EOperations} from "./e2e/messages"
import {EnvOperations} from "./env/messages"
import {UpdatesOperations} from "./updates/messages"
import {LoadsHandlers, LoadsOperations} from "./loads/messages"
import {CommandsOperations} from "./commands/messages"
import {EditorHandlers, EditorOperations} from "./editor/messages"

export type Handlers = ResultsHandlers &
  MenusHandlers &
  PanesHandlers &
  WindowHandlers &
  SessionHandlers &
  LoadsHandlers &
  PoolsHandlers &
  EditorHandlers

export type Operations = PoolsOperations &
  LegacyOperations &
  E2EOperations &
  ResultsOperations &
  EnvOperations &
  WindowOperations &
  UpdatesOperations &
  LoadsOperations &
  WindowOperations &
  MenusOperations &
  CommandsOperations &
  EditorOperations

export type OperationName = keyof Operations
export type HandlerName = keyof Handlers
