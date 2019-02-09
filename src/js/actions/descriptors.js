/* @flow */

import type {Thunk} from "redux-thunk"
import uniq from "lodash/uniq"

import type {Tuple} from "../types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "../reducers/descriptors"

export const discoverDescriptors = (events: Tuple[] = []): Thunk => {
  return (dispatch, getState) => {
    const state = getState()
    const schemas = getDescriptors(state)
    const space = getCurrentSpaceName(state)
    const unknownSchemas = uniq(
      events
        .map(([descriptorId]) => descriptorId)
        .filter(id => !schemas[space + "." + id])
    )
    unknownSchemas.forEach(id => dispatch(fetchDescriptor(id)))
  }
}

export const fetchDescriptor = (id: string): Thunk => {
  return (dispatch, getState, api) => {
    const space = getCurrentSpaceName(getState())

    dispatch(requestDescriptor(space, id))
    return api
      .descriptor({space, id})
      .done(descriptor => {
        dispatch(receiveDescriptor(space, id, descriptor))
      })
      .error(error => dispatch(errorDescriptor(error)))
  }
}

export const requestDescriptor = (space: string, id: string) => ({
  type: "DESCRIPTOR_REQUEST",
  space,
  id
})

export const receiveDescriptor = (
  space: string,
  id: string,
  descriptor: {name: string, type: string}[]
) => ({
  type: "DESCRIPTOR_RECEIVE",
  space,
  id,
  descriptor
})

export const errorDescriptor = (error: string) => ({
  type: "DESCRIPTOR_ERROR",
  error
})

export const clearDescriptors = () => ({
  type: "DESCRIPTORS_CLEAR"
})
