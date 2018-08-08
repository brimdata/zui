import {getCurrentSpace} from "../reducers/spaces"
import * as outMessages from "../treehouse/outMessages"
import uniq from "lodash/uniq"

export function requestMainSearch({saveToHistory, query}) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    saveToHistory,
    query
  }
}

export function requestMainSearchPage() {
  return {
    type: "MAIN_SEARCH_PAGE_REQUEST"
  }
}

export function mainSearchEvents(events = []) {
  return {
    type: "MAIN_SEARCH_EVENTS",
    events
  }
}

export function setMainSearchQuery(query) {
  return {
    type: "MAIN_SEARCH_QUERY",
    query
  }
}

export function completeMainSearch() {
  return {
    type: "MAIN_SEARCH_COMPLETE"
  }
}

export function appendMainSearchQueryProgram(fragment) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}

export function nextPage() {
  return {
    type: "MAIN_SEARCH_PAGE_NEXT"
  }
}

export function discoverSchemas(events = []) {
  return (dispatch, getState, _api) => {
    const schemas = getState().broSchemas
    const unknownSchemas = uniq(
      events.map(([descriptorId]) => descriptorId).filter(id => !schemas[id])
    )

    unknownSchemas.forEach(id => {
      dispatch(schemaFetch(id))
    })
  }
}

export function setSchema(id, descriptor) {
  return {
    type: "NEW_BRO_SCHEMA",
    id,
    descriptor
  }
}

export function schemaFetch(id) {
  return (dispatch, getState, api) => {
    const space = getCurrentSpace(getState())

    api.send(outMessages.fetchSchema(space, id)).done(descriptor => {
      dispatch(setSchema(id, descriptor))
    })
  }
}
