import {actions, reducer} from "./reducer"
import * as flows from "./flows"
import * as selectors from "./selectors"

/*
## on history item click:
tabHistory.push(), NO SessionHistory.push()

## on back/forward button:
NEITHER are pushed

## on search:
BOTH are pushed (IF not same as last item, respectively?)

## on select query:
BOTH are pushed (IF not same as last item, respectively?)

## on select pool:
create new version (and new query if there is not a current query)
BOTH are pushed

 */

export default {
  reducer,
  ...flows,
  ...actions,
  ...selectors,
}
