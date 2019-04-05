/* @flow */
import type {Probe} from "../reducers/investigation"

export const newProbe = (probe: Probe) => ({
  type: "PROBE_NEW",
  probe
})

export const addToProbe = (probe: Probe) => ({
  type: "PROBE_ADD_TO",
  probe
})

export type Action = typeof newProbe | typeof addToProbe
