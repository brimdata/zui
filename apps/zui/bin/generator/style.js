const {kebabCase} = require("lodash")

const {append, write} = require("../utils/file")

export function genCode(name) {
  return `.${name} {
}`
}

export function handleStyle(input) {
  let name = kebabCase(input)

  write(`src/css/_${name}.scss`, genCode(name))
  append("src/css/main.scss", `@import "${name}";\n`)
}
