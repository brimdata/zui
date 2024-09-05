type Rect = {
  x: number
  y: number
  width: number
  height: number
}

type Offset = {
  x: number
  y: number
}

export type SortableListArgs = {
  src: number | null
  items: {
    height: number
    width: number
    count: number
    gap: number
  }
  listRect: Rect
  dragRect: Rect
  startingOffset: Offset
  offset: Offset
}
