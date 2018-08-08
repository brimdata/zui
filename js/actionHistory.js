let actions = []

export function getActions() {
  return actions
}

export function clearActions() {
  actions = []
}

export function middleware(_store) {
  clearActions()
  return next => action => {
    actions.push(action)
    next(action)
  }
}
