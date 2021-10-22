import {SearchStatus} from "../../types/searches"

export type ChartData = {
  keys: string[]
  table: {
    [key: string]: {
      [key: string]: number
    }
  }
}

export type ChartState = {
  data: ChartData
  status: SearchStatus
  searchKey: string
}

export type CHART_STATUS = {
  type: "CHART_STATUS"
  status: SearchStatus
  tabId: string
}

export type CHART_RECORDS = {
  type: "CHART_RECORDS"
  data: ChartData
  tabId: string
}

export type CHART_CLEAR = {
  type: "CHART_CLEAR"
  tabId?: string
}

export type CHART_SET_SEARCH_KEY = {
  type: "CHART_SET_SEARCH_KEY"
  tabId: string
  key: string
}

export type ChartActions =
  | CHART_STATUS
  | CHART_RECORDS
  | CHART_CLEAR
  | CHART_SET_SEARCH_KEY
