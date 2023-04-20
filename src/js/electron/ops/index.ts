import {createInvoker} from "../invoker"
import {AutosaveOp} from "./autosave-op"
import {CreatePoolOp} from "./create-pool-op"
import {DeletePoolOp} from "./delete-pool-op"
import {DerivePoolNameOp} from "./derive-pool-name-op"
import {EmitRowDetailChangeOp} from "./emit-row-detail-change-op"
import {GetMenuTemplateOp} from "./get-menu-template-op"
import {InvokeCommandOp} from "./invoke-command-op"
import {LoadFilesOp} from "./load-files-op"
import {UpdatePluginLakeOp} from "./update-plugin-lake-op"
import {UpdatePluginSessionOp} from "./update-plugin-session-op"

export const loadFiles = createInvoker<LoadFilesOp>("loadFilesOp")
export const createPool = createInvoker<CreatePoolOp>("createPoolOp")
export const derivePoolName =
  createInvoker<DerivePoolNameOp>("derivePoolNameOp")
export const deletePool = createInvoker<DeletePoolOp>("deletePoolOp")
export const autosave = createInvoker<AutosaveOp>("autosaveOp")
export const emitRowDetailChange = createInvoker<EmitRowDetailChangeOp>(
  "emitRowDetailChangeOp"
)
export const updatePluginSession = createInvoker<UpdatePluginSessionOp>(
  "updatePluginSessionOp"
)
export const updatePluginLake =
  createInvoker<UpdatePluginLakeOp>("updatePluginLakeOp")
export const getMenuTemplate =
  createInvoker<GetMenuTemplateOp>("getMenuTemplateOp")
export const invokeCommand = createInvoker<InvokeCommandOp>("invokeCommandOp")
