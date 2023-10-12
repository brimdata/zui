import {createOperation} from "src/core/operations"
import Loads from "src/js/state/Loads"

export const abort = createOperation("loaders.abort", ({main}, id: string) => {
  main.abortables.abort(id)
  main.dispatch(
    Loads.update({id, changes: {abortedAt: new Date().toISOString()}})
  )
})
