/* @flow */

import {createInvestigationTree} from "./helpers"
import brim from "../../brim"

function search(pins, program) {
  return {
    ts: brim.time(new Date(0)).toTs(),
    search: {
      pins,
      program,
      spaceName: "default",
      spaceId: "defaultId",
      spanArgs: brim.dateTuple([new Date(1), new Date(2)]).toSpan()
    }
  }
}

test("Remove all pins and make a new current", () => {
  let tree = createInvestigationTree([
    search(["a", "b"], "c"),
    search(["a", "b"], "d"),
    search(["a", "b"], "d"),
    search(["a"], "d"),
    search([], "e")
  ])

  expect(tree.toJSON()).toMatchSnapshot()
})
