import * as actions from "."
import * as selectors from "../selectors/index"
import outMessages from "../treehouse/outMessages"
import eventsReceiver from "../receivers/eventsReceiver"

export function fetchMainSearchPage() {
  return (dispatch, getState, api) => {
    dispatch(actions.requestMainSearchPage())
    const query = selectors.getMainSearchQuery(getState())

    if (!query.isValid()) {
      console.warn("invalide query", query.toString())
      return
    }

    api
      .send(outMessages.fetchMainSearch(query))
      .channel(0, eventsReceiver(dispatch))
  }
}
