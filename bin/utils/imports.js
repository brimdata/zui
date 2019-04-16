/* @flow */

const fs = require("fs")

const {Importer} = require("import-js")

const {write} = require("./file")

export function fixImports(filename: string) {
  fs.readFile(filename, "utf-8", (err: ?Error, fileContent: string) => {
    if (err) return

    let lines = fileContent.split("\n")
    let importer = new Importer(lines, filename, process.cwd())

    importer
      .fixImports()
      .then((response) => write(filename, response.fileContent))
      .catch((e) => console.error(e))
  })
}
