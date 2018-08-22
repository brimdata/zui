import createReducer from "./createReducer"

export default createReducer(
  {},
  {
    DESCRIPTOR_RECEIVE: (state, {space, id, descriptor}) => ({
      ...state,
      [space + "." + id]: descriptor
    })
  }
)

export const getDescriptors = state => state.broSchemas
