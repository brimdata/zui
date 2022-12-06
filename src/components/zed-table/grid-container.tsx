import React from "react"
import {forwardRef} from "react"
import {Header} from "./header"
import {useListStyle} from "./utils"

export const InnerElement = forwardRef(function Inner(
  props: JSX.IntrinsicElements["div"],
  ref: React.Ref<HTMLDivElement>
) {
  const {style, children, ...rest} = props
  const listStyle = useListStyle(style)
  return (
    <div ref={ref} {...rest} style={listStyle}>
      <Header />
      {children}
    </div>
  )
})
