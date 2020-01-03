/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {fetchSpace, fetchSpaces} from "../services/boom"
import {setCurrentSpaceName} from "../state/actions"
import Spaces from "../state/spaces"
import Tab from "../state/tab"
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
        let clusterId = Tab.clusterId(getState())

        return dispatch(fetchSpace(name)).then((info) => {
          let space = brim.space(info)

          dispatch(setCurrentSpaceName(name))
          dispatch(Spaces.setDetail(clusterId, info))

          if (space.empty()) {
            dispatch(clearViewer(tabId))
            dispatch(modal.show("nodata"))
          } else {
            const {max_time} = Tab.space(getState())
            dispatch(
              search.setSpanArgs([
                brim
                  .time(max_time)
                  .subtract(30, "minutes")
                  .toTs(),
                max_time
              ])
            )
            dispatch(submitSearch())
          }
        })
      }
    })
  }
}
