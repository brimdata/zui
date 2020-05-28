/* @flow */
import fs from "fs"
import stream from "stream"

import type {Thunk} from "../state/types"
import Columns from "../state/Columns"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import brim from "../brim"

function toNodeReadable(reader) {
  return new stream.Readable({
    // #$FlowFixMe
    read: async function() {
      let {done, value} = await reader.read()
      this.push(done ? null : value)
    }
  })
}

function cutColumns(program, columns) {
  if (columns.allVisible()) {
    return program
  } else {
    let names = columns.getVisible().map((c) => c.name)
    return brim
      .program(program)
      .cut(...names)
      .string()
  }
}

export default (filePath: string): Thunk => async (dispatch, getState) => {
  let zealot = Tab.getZealot(getState())
  let spaceId = Tab.getSpaceId(getState())
  let baseProgram = SearchBar.getSearchProgram(getState())
  let columns = Columns.getCurrentTableColumns(getState())
  let program = cutColumns(baseProgram, columns)
  let [from, to] = Tab.getSpan(getState())
    .map(brim.time)
    .map((t) => t.toDate())

  return new Promise(async (resolve, reject) => {
    // $FlowFixMe
    let resp = await zealot.searchStream(program, {
      from,
      to,
      spaceId,
      format: "zng",
      controlMessages: false
    })
    let webReadable = resp.body.getReader()
    let data = toNodeReadable(webReadable).on("error", reject)
    let file = fs
      .createWriteStream(filePath)
      .on("error", reject)
      .on("close", resolve)

    data.pipe(file)
  })
}
