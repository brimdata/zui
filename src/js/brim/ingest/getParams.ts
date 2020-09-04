
import path from "path";

import { IngestFileType } from "./detectFileType";
import { getUniqName } from "../../lib/uniqName";
import fileList, { FileListData } from "./fileList";
import lib from "../../lib";
import time from "../time";

export type IngestParams = {
  dataDir: string;
  endpoint: IngestFileType;
  paths: string[];
};

export type IngestParamsError = {
  error: string;
};

export default function getParams(data: FileListData, dataDir?: string, existingNames?: string[] = [], now: Date = new Date()): IngestParams | IngestParamsError {
  let files = fileList(data);

  if (files.multiple() && files.any("pcap")) {
    return {
      error: "Only one pcap can be opened at a time."
    };
  }

  function getDataDir() {
    return dataDir ? path.join(dataDir, getSpaceName()) : "";
  }

  function getSpaceName() {
    let name;
    if (files.oneFile()) name = lib.file(files.first().path).fileName();else if (files.inSameDir()) name = files.dirName();else name = generateDirName(now);

    return getUniqName(name, existingNames);
  }

  return {
    name: getSpaceName(),
    dataDir: getDataDir(),
    endpoint: files.first().type,
    paths: files.paths()
  };
}

function generateDirName(now) {
  return "zeek_" + time(now).format("YYYY-MM-DD_HH:mm:ss");
}