/* @flow */
import fs from "fs"
import stream from "stream"

import type {Thunk} from "../state/types"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import brim from "../brim"
import useSetTimeout from "../components/hooks/useSetTimeout"

export default (filePath: string): Thunk => async (dispatch, getState) => {
  let zealot = Tab.getZealot(getState())
  let program = SearchBar.getSearchProgram(getState())
  let spaceId = Tab.getSpaceId(getState())
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

function toNodeReadable(reader) {
  return new stream.Readable({
    // #$FlowFixMe
    read: async function() {
      let {done, value} = await reader.read()
      this.push(done ? null : value)
    }
  })
}
