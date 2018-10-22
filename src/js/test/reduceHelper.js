export default (stateKey, reducer, initialState) => actions => ({
  [stateKey]: actions.reduce(reducer, initialState)
})
