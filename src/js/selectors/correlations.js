/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import {getCorrelations} from "../reducers/correlations"
import CorrelationAccessor from "../models/CorrelationAccessor"

export const buildCorrelations = createSelector<State, void, *, *>(
  getCorrelations,
  correlations => new CorrelationAccessor(correlations)
)
