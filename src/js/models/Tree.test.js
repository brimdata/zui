import Tree from "./Tree"

const exampleTree = {
  data: "David",
  children: [
    {
      data: "James",
      children: [
        {
          data: "Abe",
          children: []
        }
      ]
    },
    {
      data: "Chloe",
      children: [
        {
          data: "Max",
          children: []
        }
      ]
    },
    {
      data: "Gavin",
      children: []
    },
    {
      data: "Marsali",
      children: []
    }
  ]
}

test("build the tree by adding children", () => {
  let tree = new Tree({data: "David"})

  let root = tree.getRoot()

  root.addChild("James").addChild("Abe")
  root.addChild("Chloe").addChild("Max")
  root.addChild("Gavin")
  root.addChild("Marsali")

  expect(tree.toJSON()).toEqual(exampleTree)
})

test("load up a tree from JSON", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getRoot().data).toEqual("David")
})

test("depth first search from left", () => {
  const tree = new Tree(exampleTree)

  const names = []
  tree.dfSearch(node => names.push(node.data))

  expect(names).toEqual([
    "David",
    "James",
    "Abe",
    "Chloe",
    "Max",
    "Gavin",
    "Marsali"
  ])
})

test("depth first search to Array", () => {
  const tree = new Tree(exampleTree)

  const names = tree.dfArray().map(node => node.data)

  expect(names).toEqual([
    "David",
    "James",
    "Abe",
    "Chloe",
    "Max",
    "Gavin",
    "Marsali"
  ])
})

test("bredth first search from left", () => {
  const tree = new Tree(exampleTree)

  const names = []
  tree.bfSearch(node => names.push(node.data))

  expect(names).toEqual([
    "David",
    "James",
    "Chloe",
    "Gavin",
    "Marsali",
    "Abe",
    "Max"
  ])
})

test("bredth first search to Array", () => {
  const tree = new Tree(exampleTree)

  const names = tree.bfArray().map(node => node.data)

  expect(names).toEqual([
    "David",
    "James",
    "Chloe",
    "Gavin",
    "Marsali",
    "Abe",
    "Max"
  ])
})

test("find", () => {
  const tree = new Tree(exampleTree)

  const node = tree.find("Chloe")

  expect(node.data).toEqual("Chloe")
})

test("parentCount", () => {
  const tree = new Tree(exampleTree)

  expect(tree.find("Chloe").parentCount()).toBe(1)
  expect(tree.find("Abe").parentCount()).toBe(2)
})

test("getNodeAt empty indexPath", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getNodeAt([]).data).toBe("David")
})

test("getNodeAt with one item", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getNodeAt([1]).data).toBe("Chloe")
})

test("getNodeAt with two indexes", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getNodeAt([0, 0]).data).toBe("Abe")
})

test("getIndexPath", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([1, 0])

  expect(node.getIndexPath()).toEqual([1, 0])
})

test("getIndexPath when []", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([])

  expect(node.getIndexPath()).toEqual([])
})

test("getIndexPath when one level", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([0])

  expect(node.getIndexPath()).toEqual([0])
})

test("isInPath when outmost node", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([1, 0])

  expect(node.isInPath([1, 0])).toBe(true)
})

test("isInPath when inner node", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([1, 0])

  expect(node.parent.isInPath([1, 0])).toBe(true)
})

// indexPath: [3, 0] // no
//            [3]    // yes
// context:   [3]

// indexPath: [3]   // yes
// indexPath: [3, 1] // yes
// indexPath: [3, 1, 4] // no

// context: [3, 1]

test("isInPath ownPath is longer that passed In", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([0, 0])

  expect(node.isInPath([0])).toBe(false)
})

test("isInPath when exactly the same", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([0, 0])

  expect(node.isInPath([0, 0])).toBe(true)
})

test("isInPath when passed in path is longer than own", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([0])

  expect(node.isInPath([0, 9, 9])).toBe(true)
})

test("isInPath when root", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getRoot().isInPath([9, 9, 9])).toBe(true)
})

test("isInPath when first", () => {
  const tree = new Tree(exampleTree)

  expect(tree.getNodeAt([2]).isInPath([2])).toBe(true)
})

test("isLastChild returns false", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([0])

  expect(node.isLastChild()).toBe(false)
})

test("isLastChild returns true", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([3])

  expect(node.isLastChild()).toBe(true)
})

test("isLastChild when root", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([])

  expect(node.isLastChild()).toBe(true)
})

test("remove node", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([1])

  expect(tree.root.children.length).toBe(4)
  expect(tree.contains(node)).toBe(true)
  tree.remove(node)
  expect(tree.contains(node)).toBe(false)
  expect(tree.root.children.length).toBe(3)
})

test("removing the root node throws an error", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([])
  expect(() => tree.remove(node)).toThrow("Not able to remove the root node")
})

test("removing a node that does not exist in the tree", () => {
  const tree = new Tree(exampleTree)
  const node = tree.getNodeAt([1])

  expect(tree.root.children.length).toBe(4)
  expect(tree.contains(node)).toBe(true)

  tree.remove(node)
  tree.remove(node)

  expect(tree.contains(node)).toBe(false)
  expect(tree.root.children.length).toBe(3)
})
