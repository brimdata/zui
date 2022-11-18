import React from "react"
import {forwardRef} from "react"
import {useListContext} from "./context"

export const InnerElement = forwardRef<any, any>(function InnerElement(
  {style, ...rest},
  ref
) {
  const {paddingTop, paddingBottom, innerProps} = useListContext()
  return (
    <div
      role="list"
      ref={ref}
      style={{
        ...style,
        height: `${
          parseFloat(style.height) + (paddingTop ?? 0) + (paddingBottom ?? 0)
        }px`,
      }}
      {...rest}
      {...innerProps}
    />
  )
})
