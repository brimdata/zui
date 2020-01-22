/* @flow */
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"

export type ChartState = {
  records: RecordData[],
  status: SearchStatus
}

export type CHART_STATUS = {
  type: "CHART_STATUS",
  status: SearchStatus,
  tabId: string
}

export type CHART_RECORDS = {
  type: "CHART_RECORDS",
  records: RecordData[],
  tabId: string
}

export type CHART_CLEAR = {
  type: "CHART_CLEAR",
  tabId: string
}

export type ChartActions = CHART_STATUS | CHART_RECORDS | CHART_CLEAR
