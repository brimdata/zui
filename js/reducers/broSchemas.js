import createReducer from "./createReducer"

export default createReducer(
  {},
  {
    NEW_BRO_SCHEMA: (state, {id, descriptor}) => ({
      ...state,
      [id]: descriptor
    })
  }
)

export const getDescriptors = state => state.broSchemas
