/* @flow */

import type {Cluster} from "./types"
import type {Thunk} from "../types"
import {chooseSpace} from "../../space/choose"
import {fetchSpaces} from "../../backend/fetch"
import {setAppMenu} from "../../electron/setAppMenu"
import {setBoomCluster} from "../../backend/options"
import {setCluster} from "./actions"
import {setSpaceNames} from "../actions"
import {switchSpace} from "../../space/switch"

export function attemptLogin(cluster: Cluster): Thunk {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(setBoomCluster(cluster))
      dispatch(fetchSpaces())
        .done((spaces) => resolve(spaces))
        .error((e) => reject(e))
    })
      .then((names) => {
        setTimeout(() => {
          dispatch(setCluster(cluster))
          dispatch(setSpaceNames(names))
        }, 3)
        if (names.length) {
          return dispatch(switchSpace(chooseSpace(names, "")))
        }
      })
      .then(() => {
        setAppMenu("SEARCH")
      })
  }
}
