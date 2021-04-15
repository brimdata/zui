const {Project} = require("ts-morph")
const _ = require("lodash")
const {kebabCase} = require("lodash")

const project = new Project({
  tsConfigFilePath: "./tsconfig.json"
})

project.getSourceFiles().forEach((srcFile, i) => {
  // const oldName = srcFile.getBaseName()
  // const name = srcFile.getBaseNameWithoutExtension()
  // const newName = kebabCase(name) + srcFile.getExtension()
  // const newPath = srcFile.getFilePath().replace(oldName, newName)
  // console.log("--> " + newPath)
  // srcFile.moveImmediatelySync(newPath)
  const oldName = srcFile.getBaseName()

  if (oldName.endsWith("-test.ts")) {
    const newName = oldName.replace("-test.ts", ".test.ts")
    srcFile.moveImmediatelySync(newName)
    console.log("==>" + newName)
  }
})
