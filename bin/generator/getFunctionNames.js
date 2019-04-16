/* @flow */
const parser = require("@babel/parser")

const traverse = require("@babel/traverse").default
const fs = require("fs")

export function getFunctionNames(filename: string) {
  let names = []
  let file = fs.readFileSync(filename).toString()
  let ast = parser.parse(file, {
    sourceType: "module",
    plugins: ["jsx", "flow"]
  })

  traverse(ast, {
    ArrowFunctionExpression: function(path) {
      if (path.parent.id) {
        names.push(path.parent.id.name)
      }
    },

    FunctionDeclaration: function(path) {
      if (path.node.id) {
        names.push(path.node.id.name)
      }
    }
  })

  return names
}
