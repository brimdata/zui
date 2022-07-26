import Current from "src/js/state/Current"

/**
 * We've got to dispatch the url changed event because useSelector
 * subscriptions don't fire if the redux state object does not change.
 * When we push to the url and don't change any state, some subscriptions
 * will not fire.
 */

export default {
  push: (url) => (dispatch, getState) => {
    Current.getHistory(getState()).push(url)
  },

  replace: (url) => (dispatch, getState) => {
    Current.getHistory(getState()).replace(url)
  },

  goBack: () => (dispatch, getState) => {
    console.log(Current.getHistory(getState()))
    Current.getHistory(getState()).goBack()
  },

  goForward: () => (dispatch, getState) => {
    Current.getHistory(getState()).goForward()
  },
}
