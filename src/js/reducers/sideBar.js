import createReducer from "./createReducer"

const initialState = {
  isOpen: true
}

export default createReducer(initialState, {
  SIDE_BAR_OPEN: state => {
    setTimeout(triggerResize, 150)
    return {...state, isOpen: true}
  },
  SIDE_BAR_CLOSE: state => {
    setTimeout(triggerResize, 150)
    return {...state, isOpen: false}
  }
})

const triggerResize = () => window.dispatchEvent(new Event("resize"))
