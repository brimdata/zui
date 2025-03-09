import React from "react"
import {forwardRef} from "react"
import {useZedTable} from "./context"
import {Header} from "./header"
import {useListStyle} from "./utils"

export const InnerElement = forwardRef(function Inner(
  props: JSX.IntrinsicElements["div"],
  ref: React.Ref<HTMLDivElement>
) {
  const api = useZedTable()
  const {style, children, ...rest} = props
  const listStyle = useListStyle(style)
  const groups = api.headerGroups
  return (
    <div ref={ref} {...rest} style={listStyle}>
      <Header headerGroups={groups} />
      {children}
    </div>
  )
})
