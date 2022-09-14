import {ComponentType, CSSProperties} from "react"
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
  return listprops.children({item, style})
}
