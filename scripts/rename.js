const {Project} = require("ts-morph")
const _ = require("lodash")
const {kebabCase} = require("lodash")

const project = new Project({
  tsConfigFilePath: "./tsconfig.json"
})

project.getSourceFiles().forEach((srcFile, i) => {
  const name = srcFile.getBaseNameWithoutExtension()
  const newName = kebabCase(name) + srcFile.getExtension()
  srcFile.moveImmediatelySync(newName)
  console.log("moved src file to", newName)
})
