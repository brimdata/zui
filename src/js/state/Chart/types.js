/* @flow */
import type {SearchStatus} from "../../types/searches"

export type ChartData = {
  keys: string[],
  table: {[string]: {[string]: number}}
}

export type ChartState = {
  data: ChartData,
  status: SearchStatus
}

export type CHART_STATUS = {
  type: "CHART_STATUS",
  status: SearchStatus,
  tabId: string
}

export type CHART_RECORDS = {
  type: "CHART_RECORDS",
  data: ChartData,
  tabId: string
}

export type CHART_CLEAR = {
  type: "CHART_CLEAR",
  tabId: string
}

export type ChartActions = CHART_STATUS | CHART_RECORDS | CHART_CLEAR
