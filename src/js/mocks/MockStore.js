export default class MockStore {
  constructor(state) {
    this.state = state
    this.subscribers = []
    this.dispatched = []
  }

  getState() {
    return this.state
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState)
    this.subscribers.forEach(c => c())
  }

  dispatch(action) {
    this.dispatched.push(action)
  }

  subscribe(callback) {
    this.subscribers.push(callback)
  }
}
