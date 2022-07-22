import {initialResultData} from "./util"

export type ResultsStatus =
  | "INIT"
  | "FETCHING"
  | "INCOMPLETE"
  | "COMPLETE"
  | "LIMIT"
  | "ERROR"

export type ResultData = ReturnType<typeof initialResultData>
export type ResultsState = {[id: string]: ResultData}

export const MAIN_RESULTS = "zui-results/main"
