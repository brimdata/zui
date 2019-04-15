/* @flow */
import {createInvestigationTree} from "./createTree"

function search(pins, program) {
  return {
    ts: new Date(),
    record: {
      pins,
      program,
      space: "default",
      span: [new Date(), new Date()]
    }
  }
}

test("insertAppliedFilters in a variety of cases", () => {
  let investigation = [search(["a", "b"], "c")]

  expect(createInvestigationTree(investigation).toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              }
            ]
          }
        ]
      }
    ]
  })
})

test("The same applied filters do not create duplicates", () => {
  let investigation = [search(["a", "b"], "c"), search(["a", "b"], "c")]

  expect(createInvestigationTree(investigation).toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              }
            ]
          }
        ]
      }
    ]
  })
})

test("Switch the current program only", () => {
  let investigation = [search(["a", "b"], "c"), search(["a", "b"], "d")]

  expect(createInvestigationTree(investigation).toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              },
              {
                data: "d",
                children: []
              }
            ]
          }
        ]
      }
    ]
  })
})

//
test("Remove the last pins filter", () => {
  let investigation = [
    search(["a", "b"], "c"),
    search(["a", "b"], "d"),
    search(["a"], "d")
  ]

  expect(createInvestigationTree(investigation).toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              },
              {
                data: "d",
                children: []
              }
            ]
          },
          {
            data: "d",
            children: []
          }
        ]
      }
    ]
  })
})
//
test("Remove all pins and make a new current", () => {
  let tree = createInvestigationTree([
    search(["a", "b"], "c"),
    search(["a", "b"], "d"),
    search(["a"], "d"),
    search([], "e")
  ])

  expect(tree.toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              },
              {
                data: "d",
                children: []
              }
            ]
          },
          {
            data: "d",
            children: []
          }
        ]
      },
      {
        data: "e",
        children: []
      }
    ]
  })
})

test("None at all", () => {
  let tree = createInvestigationTree([
    search(["a", "b"], "c"),
    search(["a", "b"], "d"),
    search(["a"], "d"),
    search([], "e"),
    search([], "")
  ])

  expect(tree.toJSON()).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: [
              {
                data: "c",
                children: []
              },
              {
                data: "d",
                children: []
              }
            ]
          },
          {
            data: "d",
            children: []
          }
        ]
      },
      {
        data: "e",
        children: []
      }
    ]
  })
})
