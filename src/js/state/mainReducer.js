/* @flow */
export type MainState = {count: number}
let initState = {count: 1}
const reducer = (state: MainState = initState, action: *) => {
  switch (action.type) {
    case "UP":
      return {count: state.count + 1}
    case "DOWN":
      return {count: state.count - 1}
    default:
      return state
  }
}

export default reducer
