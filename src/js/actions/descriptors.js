import {getCurrentSpace} from "../reducers/spaces"
import uniq from "lodash/uniq"

export const discoverDescriptors = (events = []) => {
  return (dispatch, getState) => {
    const state = getState()
    const schemas = state.broSchemas
    const space = state.currentSpaceName
    const unknownSchemas = uniq(
      events
        .map(([descriptorId]) => descriptorId)
        .filter(id => !schemas[space + "." + id])
    )
    unknownSchemas.forEach(id => dispatch(fetchDescriptor(id)))
  }
}

export const fetchDescriptor = id => {
  return (dispatch, getState, api) => {
    const {name: space} = getCurrentSpace(getState())

    dispatch(requestDescriptor(space, id))
    return api
      .descriptor({space, id})
      .done(descriptor => {
        dispatch(receiveDescriptor(space, id, descriptor))
      })
      .error(error => dispatch(errorDescriptor(error)))
  }
}

export const requestDescriptor = (space, id) => ({
  type: "DESCRIPTOR_REQUEST",
  space,
  id
})

export const receiveDescriptor = (space, id, descriptor) => ({
  type: "DESCRIPTOR_RECEIVE",
  space,
  id,
  descriptor
})

export const errorDescriptor = error => ({
  type: "DESCRIPTOR_ERROR",
  error
})
