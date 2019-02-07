#!/usr/bin/env node

var _ = require("lodash")
var fs = require("fs-extra")
var program = require("commander")

/*
  Uitility Functions
*/

const write = (path, contents) => {
  fs.writeFileSync(path, contents)
  console.log(`Created: ${path}`)
}

const append = (path, contents) => {
  fs.appendFileSync(path, contents)
  console.log(`Appended: ${path}`)
}

const component = name =>
  `/* @flow */

import React from "react"

type Props = {}

export default class ${name} extends React.Component<Props> {
  render() {
    return (
      <div className="${_.kebabCase(name)}">
        <h1>${name}</h1>
      </div>
    )
  }
}
`

const connector = name =>
  `/* @flow */

import {bindActionCreators} from "redux"
import {connect} from "react-redux"
import ${name} from "../components/${name}"
import type {Dispatch} from "redux"
import type {State} from "../reducers/types"

const stateToProps = (state: State) => ({})

const dispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators({}, dispatch)

export default connect(
  stateToProps,
  dispatchToProps
)(${name})
`

const style = name =>
  `.${name} {

}
`

const componentTest = name =>
  `/* @flow */

import React from "react"
import {shallow} from "enzyme"
import ${name} from "./${name}"

test("snapshot", () => {
  const wrapper = shallow(<${name} />)

  expect(wrapper).toMatchSnapshot()
})
`

/*
  CLI parsing
*/

program
  .command("component <name>")
  .action(name => write(`src/js/components/${name}.js`, component(name)))

program.command("style <name>").action(name => {
  name = _.kebabCase(name)
  write(`src/css/_${name}.scss`, style(name))
  append("src/css/main.scss", `@import "${name}";\n`)
})

program
  .command("connector <name>")
  .action(name => write(`src/js/connectors/X${name}.js`, connector(name)))

program
  .command("component-test <name>")
  .action(name =>
    write(`src/js/components/${name}.test.js`, componentTest(name))
  )

program.parse(process.argv)
