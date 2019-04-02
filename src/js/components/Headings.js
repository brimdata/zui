import React from "react"

type Props = {
  children: *
}

export const SmallHeading = ({children, ...rest}: Props) => (
  <h4 className="small-heading" {...rest}>
    {children}
  </h4>
)

export const LargeHeading = ({children, ...rest}: Props) => (
  <h2 className="large-heading" {...rest}>
    {children}
  </h2>
)
