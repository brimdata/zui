import {compact} from "lodash"
import isEmpty from "lodash/isEmpty"
import {getUniqName} from "../../lib/uniqName"
import time from "../time"
import FileList, {FileListData} from "./fileList"

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
  const files = new FileList(data)

  function getPoolName() {
    let name: string
    if (files.oneFile()) {
      name = files.first().file.name
    } else if (files.inSameDir()) {
      name = isEmpty(compact(files.paths()))
        ? files.first().file.name
        : files.dirName()
    } else name = generateDirName(now)

    return getUniqName(name, existingNames)
  }

  return {
    name: getPoolName(),
    fileListData: data
  }
}

function generateDirName(now: Date) {
  return "pool_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}
