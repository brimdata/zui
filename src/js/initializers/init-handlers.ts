import {HandlerContext, setHandlerContext} from "src/core/handlers"

// All handlers must be imported here to create the listeners
import "src/domain/handlers"

export function initHandlers(context: HandlerContext) {
  setHandlerContext(context)
}
