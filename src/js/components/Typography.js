/* @flow */
import * as React from "react"
import classNames from "classnames"

type Props = {
  children?: React.Node,
  bold?: boolean,
  underline?: boolean,
  className?: string
}

export const Header = ({children, ...props}: Props) => (
  <h2 {...props} className="header">
    {children}
  </h2>
)

export const Paragraph = ({children, bold, underline, ...props}: Props) => (
  <h2 {...props} className={classNames("paragraph", {bold, underline})}>
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

export const Fieldset = ({children, ...props}: Props) => (
  <p className="fieldset" {...props}>
    {children}
  </p>
)

export const Subscript = ({children, className, ...props}: Props) => (
  <sup className={classNames("subscript", className)} {...props}>
    {children}
  </sup>
)

export const Label = ({children, ...props}: Props) => (
  <label className="label" {...props}>
    {children}
  </label>
)
