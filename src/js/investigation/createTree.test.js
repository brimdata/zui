/* @flow */
import {createInvestigationTree} from "./createTree"
import brim from "../brim"

function search(pins, program) {
  return {
    ts: brim.time(new Date(0)).toTs(),
    search: {
      pins,
      program,
      space: "default",
      spanArgs: brim.dateTuple([new Date(1), new Date(2)]).toSpanArgs()
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
