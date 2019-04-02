import reducer, {insertAppliedFilters, initialState} from "./filterTree"
import * as actions from "../actions/filterTree"
import Tree from "../models/Tree"

test("insertAppliedFilters in a variety of cases", () => {
  // From initial state
  let state = new Tree({
    data: "ROOT",
    children: [],
    parent: null
  }).toJSON()

  state = insertAppliedFilters(state, {
    pinned: ["a", "b"],
    current: "c"
  })

  expect(state).toEqual({
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

  // The same applied filters do not create duplicates
  state = insertAppliedFilters(state, {
    pinned: ["a", "b"],
    current: "c"
  })

  expect(state).toEqual({
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

  // Switch the current program only
  state = insertAppliedFilters(state, {
    pinned: ["a", "b"],
    current: "d"
  })

  expect(state).toEqual({
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

  // Rmove the last pinned filter
  state = insertAppliedFilters(state, {
    pinned: ["a"],
    current: "d"
  })

  expect(state).toEqual({
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

  // Remove all pinned and make a new current
  state = insertAppliedFilters(state, {
    pinned: [],
    current: "e"
  })

  expect(state).toEqual({
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

  // None at all
  state = insertAppliedFilters(state, {
    pinned: [],
    current: ""
  })

  expect(state).toEqual({
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

test("remove a node", () => {
  let state = insertAppliedFilters(initialState, {
    pinned: ["a", "b"],
    current: "c"
  })

  expect(state).toEqual({
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

  const tree = new Tree(state)
  const node = tree.getNodeAt([0, 0, 0])
  expect(node.data).toBe("c")

  state = reducer(state, actions.removeFilterTreeNode(node))

  expect(state).toEqual({
    data: "ROOT",
    children: [
      {
        data: "a",
        children: [
          {
            data: "b",
            children: []
          }
        ]
      }
    ]
  })
})
