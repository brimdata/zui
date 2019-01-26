/* @flow */
import * as React from "react"

type Props = {
  children?: React.Node
}

export const Header = ({children, ...props}: Props) => (
  <h2 {...props} className="header">
    {children}
  </h2>
)

export const Paragraph = ({children, ...props}: Props) => (
  <h2 {...props} className="paragraph">
    {children}
  </h2>
)

export const Code = ({children, ...props}: Props) => (
  <pre {...props} className="code">
    {children}
  </pre>
)
