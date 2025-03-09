import {initialResultData} from "./util"

export type ResultsStatus =
  | "INIT"
  | "FETCHING"
  | "INCOMPLETE"
  | "COMPLETE"
  | "ERROR"

export type ResultData = ReturnType<typeof initialResultData>
export type ResultsState = {[id: string]: ResultData}
