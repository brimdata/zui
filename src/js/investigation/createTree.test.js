/* @flow */
import {createInvestigationTree} from "./createTree"

function search(pins, program) {
  return {
    ts: new Date(0),
    search: {
      pins,
      program,
      space: "default",
      span: [new Date(1), new Date(2)]
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
