import Current from "src/js/state/Current"

export default {
  push: (url) => (_, getState) => Current.getHistory(getState()).push(url),

  replace: (url) => (_, getState) =>
    Current.getHistory(getState()).replace(url),

  goBack: () => (_, getState) => Current.getHistory(getState()).goBack(),

  goForward: () => (_, getState) => Current.getHistory(getState()).goForward()
}
