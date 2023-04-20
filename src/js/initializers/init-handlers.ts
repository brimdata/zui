import {HandlerContext, setHandlerContext} from "src/core/handlers"

// All handlers must be imported here to create the listeners
import "src/domain/results/handlers"
import "src/domain/menus/handlers"
import "src/domain/panes/handlers"

export function initHandlers(context: HandlerContext) {
  setHandlerContext(context)
}
