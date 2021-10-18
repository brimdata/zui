import {isEqual} from "lodash"
import {createSelectorCreator, defaultMemoize} from "reselect"

export const createIsEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)
