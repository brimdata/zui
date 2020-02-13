/* @flow */
const util = require("util")

const exec = util.promisify(require("child_process").exec)
const path = require("path")

async function bash(script) {
  const {stdout, stderr} = await exec(script)
  if (stderr) throw new Error(stderr)
  return stdout
}

function safeRequire(file) {
  try {
    // $FlowFixMe
    return require(file)
  } catch (_e) {
    console.log("Unable to load file: ", file)
  }
}

export async function printSelectors() {
  let output = await bash("find ./dist/js -type file -name selectors.js")
  let files = output.split("\n")

  files.forEach((f) => {
    let matches = Array.from(f.matchAll(/state\/(\w+)\/selectors.js/g))
    let absPath = path.join(process.cwd(), f).toString()
    let name = matches[0] && matches[0][1]
    if (!name) return
    let module = safeRequire(absPath)
    if (module) {
      let methods = Object.keys(module.default)
      methods.forEach((method) => console.log(name + "." + method))
    }
  })
}
