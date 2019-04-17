/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import type {TupleSet} from "../../types"
import {getResults} from "../results/selector"
import Log from "../../models/Log"

export const getLogs = createSelector<State, void, Log[], TupleSet>(
  getResults,
  (results) => {
    return Log.fromTupleSet(results)
  }
)
