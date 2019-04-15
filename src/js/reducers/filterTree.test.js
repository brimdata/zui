/* @flow */
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
    pins: ["a", "b"],
    program: "c"
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
    pins: ["a", "b"],
    program: "c"
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
    pins: ["a", "b"],
    program: "d"
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

  // Rmove the last pins filter
  state = insertAppliedFilters(state, {
    pins: ["a"],
    program: "d"
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

  // Remove all pins and make a new current
  state = insertAppliedFilters(state, {
    pins: [],
    program: "e"
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
    pins: [],
    program: ""
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
    pins: ["a", "b"],
    program: "c"
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
