import Current from "src/js/state/Current"
import Url from "src/js/state/Url"

/**
 * We've got to dispatch the url changed event because useSelector
 * subscriptions don't fire if the redux state object does not change.
 * When we push to the url and don't change any state, some subscriptions
 * will not fire.
 */

export default {
  push: (url) => (dispatch, getState) => {
    Current.getHistory(getState()).push(url)
    dispatch(Url.changed())
  },

  replace: (url) => (dispatch, getState) => {
    Current.getHistory(getState()).replace(url)
    dispatch(Url.changed())
  },

  goBack: () => (dispatch, getState) => {
    Current.getHistory(getState()).goBack()
    dispatch(Url.changed())
  },

  goForward: () => (dispatch, getState) => {
    Current.getHistory(getState()).goForward()
    dispatch(Url.changed())
  }
}
