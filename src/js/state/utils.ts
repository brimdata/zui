import {isEqual} from "lodash"
import {createSelectorCreator, defaultMemoize} from "reselect"

export const createIsEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

export function entitiesToArray(ids, entities) {
  return ids.map((id) => entities[id])
}
