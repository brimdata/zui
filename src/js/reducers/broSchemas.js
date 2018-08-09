import createReducer from "./createReducer"

export default createReducer(
  {},
  {
    NEW_BRO_SCHEMA: (state, {spaceName, id, descriptor}) => ({
      ...state,
      [spaceName + "." + id]: descriptor
    })
  }
)

export const getDescriptors = state => state.broSchemas
