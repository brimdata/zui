import {newPool} from "./handlers"
import * as ops from "./operations"

export type PoolsOperations = {
  "pools.create": typeof ops.create
  "pools.delete": typeof ops.deletePool
  "pools.update": typeof ops.update
  "pools.load": typeof ops.load
  "pools.createSettings": typeof ops.createSettings
  "pools.updateSettings": typeof ops.updateSettings
  "pools.getSettings": typeof ops.getSettings
}

export type PoolsHandlers = {
  "pools.new": typeof newPool
}
