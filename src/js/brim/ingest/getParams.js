/* @flow */
import os from "os"
import path from "path"

import type {IngestFileType} from "./detectFileType"
import fileList, {type FileListData} from "./fileList"
import time from "../time"

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
  home?: string = os.homedir(),
  now?: Date = new Date()
): IngestParams | IngestParamsError {
  let files = fileList(data)

  if (files.multiple() && files.allPcap()) {
    return {
      error: "Only one pcap can be opened at a time."
    }
  }

  if (files.multiple() && files.mixed()) {
    return {
      error: "Only files of a single type (zeek or pcap) can be opened."
    }
  }

  function getDataDir() {
    if (files.oneFile()) return path.normalize(files.first().path)

    let dirName = files.inSameDir() ? files.dirName() : generateDirName(now)

    return path.join(home, ".brim", dirName)
  }

  return {
    dataDir: getDataDir() + ".brim",
    endpoint: files.first().type,
    paths: files.paths()
  }
}

function generateDirName(now) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss")
}
