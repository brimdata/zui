import * as selectors from "./selectors"
import {slice} from "./slice"

export default {
  ...slice.actions,
  ...selectors,
}
