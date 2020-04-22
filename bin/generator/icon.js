/* @flow */

import {camelCase, kebabCase, upperFirst} from "lodash"

import {write} from "../utils/file"

export function handleIcon(input: string) {
  let name = upperFirst(camelCase(input))
  let className = kebabCase(input) + "-icon"
  let importPath = `../../static/icons/${input}.svg`
  let contents = genContents(name, importPath, className)
  write(`src/js/icons/${name}Icon.js`, contents)
}

function genContents(name, importPath, className) {
  return `/* @flow */

import React from "react"

import ${name}Svg from "${importPath}"

export default function ${name}Icon(props: *) {
  return <${name}Svg className="${className}" {...props} />
}

`
}
