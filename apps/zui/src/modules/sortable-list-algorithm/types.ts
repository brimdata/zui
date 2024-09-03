export type SortableListArgs = {
  src: number | null
  items: {
    size: number
    count: number
    gap: number
  }
  listRect: {
    x: number
    y: number
    width: number
    height: number
  }
  startingOffset: {
    x: number
    y: number
  }
  offset: {
    x: number
    y: number
  }
}

function onDragStart() {
  // measure the list rect
  // measure the items
  // set the src index
  // set the offsetStart
  // start.x
  // start.y
}

function onDragMove() {
  // set the offset
}

function onDragEnd() {
  // run the callback with the src and dst as arguments
}
