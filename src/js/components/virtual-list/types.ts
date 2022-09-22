import {CSSProperties, HTMLAttributes, ReactElement} from "react"

export type ListProps<Item> = {
  items: Item[]
  children: (props: ItemProps<Item>) => ReactElement<any, any> | null
  rowHeight?: number
  paddingTop?: number
  paddingBottom?: number
  innerProps?: HTMLAttributes<any>
}

export type ItemProps<Item> = {
  item: Item
  style: CSSProperties
  aria: HTMLAttributes<any>
}
