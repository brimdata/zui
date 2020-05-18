/* @flow */
import type {IngestFileType} from "./detectFileType"
import fileList, {type FileListData} from "./fileList"
import time from "../time"
import lib from "../../lib"
import path from "path"

export type IngestParams = {
  dataDir: string,
  endpoint: IngestFileType,
  paths: string[]
}

export type IngestParamsError = {
  error: string
}

export default function getParams(
  data: FileListData,
  dataDir: string,
  now: Date = new Date()
): IngestParams | IngestParamsError {
  let files = fileList(data)

  if (files.multiple() && files.any("pcap")) {
    return {
      error: "Only one pcap can be opened at a time."
    }
  }

  function getDataDir() {
    return dataDir ? path.join(dataDir, getSpaceName()) : ""
  }

  function getSpaceName() {
    let name
    if (files.oneFile()) name = lib.file(files.first().path).fileName()
    else if (files.inSameDir()) name = files.dirName()
    else name = generateDirName(now)

    return name + ".brim"
  }

  return {
    name: getSpaceName(),
    dataDir: getDataDir(),
    endpoint: files.first().type,
    paths: files.paths()
  }
}

function generateDirName(now) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}
