import lib from "../../lib"
import {getUniqName} from "../../lib/uniqName"
import time from "../time"
import fileList, {FileListData} from "./fileList"

export type IngestParams = {
  name: string
  fileListData: FileListData
}

export type IngestParamsError = {
  error: string
}

export default function getParams(
  data: FileListData,
  existingNames: string[] = [],
  now: Date = new Date()
): IngestParams | IngestParamsError {
  const files = fileList(data)

  function getPoolName() {
    let name: string
    if (files.oneFile()) name = lib.file(files.first().file.path).fileName()
    else if (files.inSameDir()) name = files.dirName()
    else name = generateDirName(now)

    return getUniqName(name, existingNames)
  }

  return {
    name: getPoolName(),
    fileListData: data
  }
}

function generateDirName(now: Date) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}
