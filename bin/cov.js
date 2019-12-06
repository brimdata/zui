/* @flow */
const fs = require("fs")
const path = require("path")
let file = fs.readFileSync("./coverage/coverage-final.json", "utf-8")

function report(info) {
  let covered = 0
  // $FlowFixMe
  let statements = Object.values(info.s)
  for (let hits of statements) if (hits !== 0) covered += 1
  return [covered, statements.length]
}

function htmlPath(info) {
  // $FlowFixMe
  let shortPath = info.path.replace(/^.*\/src\/(.*)$/, "$1")
  return path.join("coverage/lcov-report/" + shortPath) + ".html"
}

function leftPad(str, len) {
  let diff = len - str.length
  let pad = ""
  while (diff > 0) {
    pad += " "
    diff -= 1
  }
  return `${pad}${str}`
}

function percent(top, bottom) {
  let red = "\x1b[31m"
  let green = "\x1b[32m"
  let yellow = "\x1b[33m"
  let reset = "\x1b[0m"
  if (bottom === 0) return leftPad("-", 7)

  let num = (top / bottom) * 100
  let color
  if (num >= 90) color = green
  else if (num >= 50) color = yellow
  else color = red

  return `${color}${leftPad(num.toFixed(2), 6)}%${reset}`
}

let filterArg = process.argv[2]
let allCov = 0
let allState = 0
for (let [name, info] of Object.entries(JSON.parse(file))) {
  if (filterArg === undefined || name.match(filterArg)) {
    let [covered, total] = report(info)
    allCov += covered
    allState += total

    console.log(percent(covered, total), htmlPath(info))
  }
}
console.log("-------")
console.log(
  percent(allCov, allState),
  'Total (Update with: "npm test -- --coverage")'
)
