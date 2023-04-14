import {createInvoker} from "../invoker"
import {AutosaveOp} from "./autosave-op"
import {CreatePoolOp} from "./create-pool-op"
import {DeletePoolOp} from "./delete-pool-op"
import {DerivePoolNameOp} from "./derive-pool-name-op"
import {LoadFilesOp} from "./load-files-op"

export const loadFiles = createInvoker<LoadFilesOp>("loadFilesOp")
export const createPool = createInvoker<CreatePoolOp>("createPoolOp")
export const derivePoolName =
  createInvoker<DerivePoolNameOp>("derivePoolNameOp")
export const deletePool = createInvoker<DeletePoolOp>("deletePoolOp")
export const autosave = createInvoker<AutosaveOp>("autosaveOp")
