/* @flow */

import type {Descriptors} from "../../types"
import type {RecordData} from "../../types/records"
import type {
  VIEWER_CLEAR,
  VIEWER_COLUMNS,
  VIEWER_RECORDS,
  VIEWER_SPLICE,
  VIEWER_STATUS,
  ViewerStatus
} from "./types"
import {hashDescriptorKeys} from "./hashDescriptorKeys"

export function clearViewer(): VIEWER_CLEAR {
  return {type: "VIEWER_CLEAR"}
}

export function spliceViewer(index: number): VIEWER_SPLICE {
  return {type: "VIEWER_SPLICE", index}
}

export function setViewerStatus(status: ViewerStatus): VIEWER_STATUS {
  return {type: "VIEWER_STATUS", status}
}

export function appendViewerRecords(records: RecordData[]): VIEWER_RECORDS {
  return {type: "VIEWER_RECORDS", records}
}

export function updateViewerColumns(desc: Descriptors): VIEWER_COLUMNS {
  return {
    type: "VIEWER_COLUMNS",
    columns: hashDescriptorKeys(desc)
  }
}
