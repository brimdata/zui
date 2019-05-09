/* @flow */

import * as React from "react"
import classNames from "classnames"

import {capitalize} from "../lib/Str"

type Props = {
  children?: React.Node,
  className?: string,
  bold?: boolean,
  underline?: boolean,
  italic?: boolean,
  "white-1"?: boolean,
  "white-2"?: boolean,
  "white-3"?: boolean,
  "white-4"?: boolean,
  "white-5"?: boolean,
  "white-6"?: boolean,
  "white-7"?: boolean,
  "white-8"?: boolean,
  "white-9"?: boolean,
  "gray-1"?: boolean,
  "gray-2"?: boolean,
  "gray-3"?: boolean,
  "gray-4"?: boolean,
  "gray-5"?: boolean,
  "gray-6"?: boolean,
  "gray-7"?: boolean,
  "gray-8"?: boolean,
  "gray-9"?: boolean
}
const VARIATIONS = [
  "bold",
  "underline",
  "italic",
  "white-1",
  "white-2",
  "white-3",
  "white-4",
  "white-5",
  "white-6",
  "white-7",
  "white-8",
  "white-9",
  "gray-1",
  "gray-2",
  "gray-3",
  "gray-4",
  "gray-5",
  "gray-6",
  "gray-7",
  "gray-8",
  "gray-9"
]

function createTypeEl(tag, name) {
  const TypeComp = function({children, ...props}: Props) {
    return React.createElement(
      tag,
      {...props, className: createClassName(name, props)},
      children
    )
  }
  TypeComp.displayName = capitalize(name)
  return TypeComp
}

function createClassName(name, props) {
  function reducer(obj, name) {
    obj[name] = props[name]
    return obj
  }
  return classNames(name, props.className, VARIATIONS.reduce(reducer, {}))
}

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
