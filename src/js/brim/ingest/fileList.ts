import {IngestFileType} from "./detectFileType"
import lib from "../../lib"

export type FileListData = {type: IngestFileType; path: string}[]

export default function fileList(files: FileListData) {
  return {
    first() {
      return files[0]
    },

    oneFile() {
      return files.length === 1
    },

    multiple() {
      return files.length > 1
    },

    paths(): string[] {
      return files.map((f) => f.path)
    },

    any(type: string) {
      return !!files.find((f) => f.type === type)
    },

    allPcap() {
      return files.every((f) => f.type === "pcap")
    },

    mixed() {
      return !files.every((f) => f.type === files[0].type)
    },

    inSameDir() {
      return files.every(
        (f) => lib.file(f.path).dirName() === lib.file(files[0].path).dirName()
      )
    },

    dirName() {
      return lib.file(files[0].path).dirName()
    }
  }
}
