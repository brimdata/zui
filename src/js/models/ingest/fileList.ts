import {IngestFileType} from "./detectFileType"
import file from "src/js/lib/file"

export type FileListData = {type: IngestFileType; file: File}[]

export default class FileList {
  constructor(private list: FileListData) {}
  first() {
    return this.list[0]
  }

  oneFile() {
    return this.list.length === 1
  }

  multiple() {
    return this.list.length > 1
  }

  paths(): string[] {
    return this.list.map((f) => f.file.path)
  }

  files(): File[] {
    return this.list.map((f) => f.file)
  }

  any(type: string) {
    return !!this.list.find((f) => f.type === type)
  }

  allPcap() {
    return this.list.every((f) => f.type === "pcap")
  }

  mixed() {
    return !this.list.every((f) => f.type === this.list[0].type)
  }

  inSameDir() {
    return this.list.every(
      (item) =>
        file(item.file.path).dirName() ===
        file(this.list[0].file.path).dirName()
    )
  }

  dirName() {
    return file(this.list[0].file.path).dirName()
  }
}
