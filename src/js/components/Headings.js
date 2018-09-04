import React from "react"

export const SmallHeading = ({children, ...rest}) => (
  <h4 className="small-heading" {...rest}>
    {children}
  </h4>
)

export const LargeHeading = ({children, ...rest}) => (
  <h2 className="large-heading" {...rest}>
    {children}
  </h2>
)
