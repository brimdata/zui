import {createInvoker} from "../invoker"
import {CreatePoolOp} from "./create-pool-op"
import {LoadFilesOp} from "./load-files-op"

export const loadFiles = createInvoker<LoadFilesOp>("loadFilesOp")
export const createPool = createInvoker<CreatePoolOp>("createPoolOp")
