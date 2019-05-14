/* @flow */

import * as React from "react"
import classNames from "classnames"
import createTypeEl from "./createTypeEl"

export const Header = createTypeEl("h2", "header")
export const Paragraph = createTypeEl("p", "paragraph")
export const Mono = createTypeEl("p", "mono")
export const Fieldset = createTypeEl("p", "fieldset")
export const Subscript = createTypeEl("sup", "subscript")
export const Label = createTypeEl("label", "lable")
export const Title = createTypeEl("h1", "title")
export const Link = createTypeEl("a", "link")
export const LinkButton = createTypeEl("a", "link-button")
export const Stats = createTypeEl("span", "stats")

type CodeProps = {
  children?: React.Node,
  light?: boolean,
  full?: boolean
}

export const Code = ({children, full, light, ...props}: CodeProps) => (
  <pre {...props} className={classNames("code", {full, light})}>
    {children}
  </pre>
)
