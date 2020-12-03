import {Ref} from "react"
import {DropResult} from "react-beautiful-dnd"

export type TreeListProps = {
  root: {items: TreeItem[]}
  itemHeight: number
  onItemClick: (e: MouseEvent, item: TreeItem) => void
  onItemContextMenu: (
    e: MouseEvent,
    item: TreeItem,
    selections: TreeItem[]
  ) => void
  onItemMove: (source: TreeItem, dest: TreeItem) => void
  children: ItemRenderer
}

export interface TreeItem {
  id: string
}

export type ItemRendererProps = {
  item: TreeItem
  itemProps: object
  isSelected: boolean
  innerRef: Ref<Element>
}

export type ItemRenderer = (props: ItemRendererProps) => JSX.Element

export type TreeController = {
  ItemRenderer: ItemRenderer
  onClick: (e: MouseEvent, item: TreeItem, index: number) => void
  onContextMenu: (e: MouseEvent, item: TreeItem) => void
  onMove: (result: DropResult) => void
  isSelected: (index: number) => boolean
}
