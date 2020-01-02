/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {fetchSpace, fetchSpaces} from "../services/boom"
import {getCurrentSpaceTimeWindow} from "../state/reducers/spaces"
import {setCurrentSpaceName, setSpaceInfo} from "../state/actions"
import brim from "../brim"
import modal from "../state/modal"
import notice from "../state/notice"
import search from "../state/search"
import submitSearch from "./submitSearch"
import tabs from "../state/tabs"

export function initSpace(space: string): Thunk {
  return function(dispatch, getState) {
    let tabId = tabs.getActive(getState())
    return dispatch(fetchSpaces()).then((spaces) => {
      if (spaces.length === 0) {
        dispatch(notice.set(new NoSpacesError()))
      } else {
        let name = spaces.includes(space) ? space : spaces[0]
        dispatch(fetchSpace(name)).then((info) => {
          let space = brim.space(info)

          dispatch(setCurrentSpaceName(name))
          dispatch(setSpaceInfo(info))

          if (space.empty()) {
            dispatch(clearViewer(tabId))
            dispatch(modal.show("nodata"))
          } else {
            const [_, max] = getCurrentSpaceTimeWindow(getState())
            dispatch(
              search.setSpanArgs([
                brim
                  .time(max)
                  .subtract(30, "minutes")
                  .toTs(),
                max
              ])
            )
            dispatch(submitSearch())
          }
        })
      }
    })
  }
}
