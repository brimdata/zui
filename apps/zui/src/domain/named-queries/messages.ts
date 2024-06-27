import * as handlers from "./handlers"

export type NamedQueriesHandlers = {
  "namedQueries.update": typeof handlers.update
}
