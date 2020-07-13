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
      const {done, value} = await reader.read()
      this.push(done ? null : value)
    }
  })
}

function cutColumns(program, columns) {
  if (columns.allVisible()) {
    return program
  } else {
    const names = columns.getVisible().map((c) => c.name)
    return brim
      .program(program)
      .cut(...names)
      .string()
  }
}

export default (filePath: string): Thunk => async (dispatch, getState) => {
  const zealot = Tab.getZealot(getState())
  const spaceId = Tab.getSpaceId(getState())
  const baseProgram = SearchBar.getSearchProgram(getState())
  const columns = Columns.getCurrentTableColumns(getState())
  const program = cutColumns(baseProgram, columns)
  const [from, to] = Tab.getSpan(getState())
    .map(brim.time)
    .map((t) => t.toDate())

  return new Promise(async (resolve, reject) => {
    // $FlowFixMe
    const resp = await zealot.search(program, {
      from,
      to,
      spaceId,
      format: "zng",
      controlMessages: false
    })
    const webReadable = resp.origResp.body.getReader()
    const data = toNodeReadable(webReadable).on("error", reject)
    const file = fs
      .createWriteStream(filePath)
      .on("error", reject)
      .on("close", resolve)

    data.pipe(file)
  })
}
