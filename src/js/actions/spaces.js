import * as outMessages from "../boom/outMessages"

export function fetchSpaceInfo(name) {
  return (dispatch, getState, api) => {
    api.space({name}).done(space => {
      dispatch(setSpaceInfo(space))
    })
  }
}

export const fetchAllSpaces = () => (dispatch, _getState, api) => {
  dispatch(requestAllSpaces())
  api
    .spaces()
    .done(spaces => {
      spaces.forEach(name => dispatch(fetchSpaceInfo(name)))
    })
    .error(e => console.log(e))
}

export const requestAllSpaces = () => {
  return {
    type: "ALL_SPACES_REQUEST"
  }
}

export function setSpaceInfo(spaceInfo) {
  return {
    type: "SPACE_INFO_SET",
    spaceInfo
  }
}

export function requestSpaceInfo(name) {
  return {
    type: "SPACE_INFO_REQUEST",
    name
  }
}

export function setCurrentSpaceName(name) {
  return {
    type: "CURRENT_SPACE_NAME_SET",
    name
  }
}

export function unselectSpace() {
  return {
    type: "SPACE_UNSELECT"
  }
}

export const fetchSpaceStats = name => {
  return (dispatch, _getState) => {
    dispatch(requestSpaceStats(name))
  }
}

export const requestSpaceStats = name => ({
  type: "SPACE_STATS_REQUEST",
  name
})

export const receiveSpaceStats = name => ({type: "SPACE_STATS_RECEIVE", name})

export const errorSpaceStats = name => ({type: "SPACE_STATS_ERROR", name})
