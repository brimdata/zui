import {Group} from "./types"
import lib from "../../lib"

export const parseJSONLib = (file: File): Group => {
  const contents = lib.file(file.path).readSync()
  const rawLib = JSON.parse(contents)

  return rawLib as Group
}
