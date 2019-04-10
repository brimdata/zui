/* @flow */
import type {Probe} from "../reducers/investigation"

export const newProbe = (probe: $Shape<Probe>) => ({
  type: "PROBE_NEW",
  probe
})

export const addToProbe = (probe: $Shape<Probe>) => ({
  type: "PROBE_ADD_TO",
  probe
})

export const clearInvestigation = () => ({
  type: "INVESTIGATION_CLEAR"
})

export type Action = typeof newProbe | typeof addToProbe
