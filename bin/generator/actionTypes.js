/* @flow */

const child_process = require("child_process")

const {append} = require("../utils/file")
const {getFunctionNames} = require("./getFunctionNames")
const {prettify} = require("../utils/prettify")

const AUTOGEN = "AUTO GENERATED"
const ACTIONS_PATH = "src/js/state/actions.js"

function genCode(actionNames) {
  if (actionNames.length == 0) return ""
  return `
    /* ${AUTOGEN} */

    export type Action = ${actionNames
      .map((name) => `typeof ${name}`)
      .join(" | \n")}
    `
}

function deleteActionTypes(filename) {
  child_process.execSync(`sed -i '' '/${AUTOGEN}/,$d' ${filename}`)
}

export function handleActionTypes() {
  deleteActionTypes(ACTIONS_PATH)
  append(ACTIONS_PATH, genCode(getFunctionNames(ACTIONS_PATH)))
  prettify(ACTIONS_PATH)
}
