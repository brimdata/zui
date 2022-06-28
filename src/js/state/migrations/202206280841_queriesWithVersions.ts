import {getAllStates} from "./utils/getTestState"
import TreeModel from "tree-model"
import {nanoid} from "@reduxjs/toolkit"
import util from "util"

export const flattenQueryTree = (root) => {
  return new TreeModel({childrenPropertyName: "items"}).parse(root).all((n) => {
    return !("items" in n.model)
  })
}

export default function queriesWithVersions(state: any) {
  for (const s of getAllStates(state)) {
    // remove brim standard lib
    const brimLibNdx = s.queries.items?.findIndex(({id}) => id === "brim")
    if (brimLibNdx > -1) s.queries.items?.splice(brimLibNdx, 1)

    const versions = {}
    for (const q of flattenQueryTree(s.queries)) {
      const version = {
        version: nanoid(),
        ts: new Date().toISOString(),
        value: q.model.value,
      }
      versions[q.model.id] = {
        ids: [version.version],
        entities: {
          [version.version]: version,
        },
      }
      delete q.model.value
      delete q.model.from
    }
    s.queryVersions = versions
    console.log(
      "queryVersions is: ",
      util.inspect(s.queryVersions, false, null, true)
    )
  }

  return state
}
