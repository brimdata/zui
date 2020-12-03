import {useState, RefObject} from "react"
import Selector from "../models/selector"
import {TreeController, TreeListProps} from "../types"
import {useKeyBindings} from "./useKeyBindings"

export function useController(
  ref: RefObject<Element>,
  props: TreeListProps
): TreeController {
  const items = props.root.items
  const [selector, setSelector] = useState(new Selector(items.length))
  useKeyBindings(ref, selector, setSelector)

  return {
    ItemRenderer: props.children,
    onClick(e, item, index) {
      if (e.metaKey) {
        selector.selectMulti(index)
        setSelector(selector.dup())
      } else if (e.shiftKey) {
        selector.selectRange(index)
        setSelector(selector.dup())
      } else {
        selector.select(index)
        selector.clear()
        setSelector(selector.dup())
        props.onItemClick(e, item)
      }
    },
    onContextMenu(e, item) {
      props.onItemContextMenu(
        e,
        item,
        selector.getIndices().map((index) => items[index])
      )
    },
    onMove(result) {
      if (result.destination) {
        const source = items[result.source.index]
        const destination = items[result.destination.index]
        props.onItemMove(source, destination)
      }
    },
    isSelected(index) {
      return selector.isSelected(index)
    }
  }
}
