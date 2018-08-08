export default _store => next => {
  window.onpopstate = _event => pop()

  return action => {
    if (action.type === "MAIN_SEARCH_REQUEST" && action.saveToHistory) {
      push()
    }
    next(action)
  }
}

function push() {}
function pop() {}
