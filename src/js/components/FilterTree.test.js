/* @flow */
import {getPinnedFilters, nodeIsPinned} from "./FilterTree"
import Tree from "../models/Tree"

const treeData = {
  data: "ROOT",
  children: [
    {
      data: "dns",
      children: []
    },
    {
      data: "_path=dns",
      children: [
        {
          data: "domex.nps.edu*",
          children: [
            {
              data: "udp",
              children: []
            },
            {
              data: "5353",
              children: []
            }
          ]
        },
        {
          data: "5353",
          children: [
            {
              data: "amazing",
              children: []
            }
          ]
        }
      ]
    }
  ]
}

test("getPinnedFilters", () => {
  const tree = new Tree(treeData)
  const node = tree.getNodeAt([1, 0, 1])
  expect(node.data).toBe("5353")

  const filters = getPinnedFilters(node)

  expect(filters).toEqual(["_path=dns", "domex.nps.edu*", "5353"])
})

test("nodeIsPinned when the whole path matches", () => {
  const tree = new Tree(treeData)
  const node = tree.getNodeAt([1, 0, 1])
  const pinnedFilters = ["_path=dns", "domex.nps.edu*", "5353"]

  expect(nodeIsPinned(pinnedFilters, node)).toBe(true)
})

test("nodeIsPinned when one random node matches", () => {
  const tree = new Tree(treeData)
  const node = tree.getNodeAt([1, 1])
  const pinnedFilters = ["domex.nps.edu*", "5353"]

  expect(nodeIsPinned(pinnedFilters, node)).toBe(false)
})
