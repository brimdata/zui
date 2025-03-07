import {ComponentType, CSSProperties, HTMLAttributes} from "react"
import {ListChildComponentProps} from "react-window"
import {useListContext} from "./context"

export const VirtualRow: ComponentType<ListChildComponentProps<any>> = (
  props
) => {
  const listprops = useListContext()
  const style: CSSProperties = {
    ...props.style,
    top: parseFloat(props.style.top as string) + (listprops.paddingTop ?? 0),
  }
  const item = props.data[props.index]
  const aria: HTMLAttributes<any> = {
    role: "listitem",
    "aria-setsize": listprops.items.length,
    "aria-posinset": props.index + 1,
  }
  return listprops.children({item, style, aria})
}
