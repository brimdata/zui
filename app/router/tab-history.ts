import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"

/**
 * We've got to dispatch the url changed event because useSelector
 * subscriptions don't fire if the redux state object does not change.
 * When we push to the url and don't change any state, some subscriptions
 * will not fire.
 */

export default {
  push: (url: string): Thunk => (dispatch, getState) => {
    Current.getHistory(getState()).push(url)
    dispatch(Url.changed())
  },

  replace: (url: string): Thunk => (dispatch, getState) => {
    Current.getHistory(getState()).replace(url)
    dispatch(Url.changed())
  },

  goBack: (): Thunk => (dispatch, getState) => {
    Current.getHistory(getState()).goBack()
    dispatch(Url.changed())
  },

  goForward: (): Thunk => (dispatch, getState) => {
    Current.getHistory(getState()).goForward()
    dispatch(Url.changed())
  }
}
