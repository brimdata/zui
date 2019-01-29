/* @flow */
import * as React from "react"
import classNames from "classnames"

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

type CodeProps = {
  children?: React.Node,
  light?: boolean,
  full?: boolean
}

export const Code = ({children, ...props}: CodeProps) => (
  <pre
    {...props}
    className={classNames("code", {full: props.full, light: props.light})}
  >
    {children}
  </pre>
)
