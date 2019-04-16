/* @flow */
const child_process = require("child_process")

// function removeBadRefs() {
//   const paths = []
//   const files = child_process.execSync("./bin/fixer/badrefs").toString()
//
//   files.split("\n").forEach((file) => {
//     const [path, line, endline] = file.split(":")
//     if (path && line && endline) {
//       paths.push(path)
//       removeLine(path, line, endline)
//     }
//   })
//
//   return paths
// }

// function removeLine(path, line, endline) {
//   let cmd = `sed -i "" '${line},${endline}s/.*//' ${path}`
//   child_process.execSync(cmd)
// }

export function handleRefs() {
  console.log("Fixing refs is a work in progress and doesnt work yet")
  return
  // const badFiles = removeBadRefs()
  //
  // badFiles.forEach((file) => {
  //   console.log("Attempting fix: ", file)
  //   fixImports(file)
  //   prettify(file)
  // })
}
