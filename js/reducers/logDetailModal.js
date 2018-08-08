const initalState = {
  lineId: null
}

export default function(state = initalState, action) {
  switch (action.type) {
    case "LOG_DETAIL_MODAL_REQUESTED":
      return {
        lineId: action.lineId
      }
    default:
      return state
  }
}
