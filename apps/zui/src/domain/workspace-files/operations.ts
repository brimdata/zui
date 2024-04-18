import {createOperation} from "src/core/operations"
import fs from "node:fs"
import pathmod from "node:path"
import {cache} from "src/util/cache"

class FSEntry {
  children: FSEntry[] | null = null

  constructor(public path: string) {
    if (this.isDir) {
      this.children = fs.readdirSync(path).map((name) => {
        return new FSEntry(pathmod.join(path, name))
      })
    }
  }

  get name() {
    return pathmod.basename(this.path)
  }

  get ext() {
    return pathmod.extname(this.path)
  }

  get dir() {
    return pathmod.dirname(this.path)
  }

  get stats() {
    return cache(this, "_stats", () => fs.statSync(this.path))
  }

  get isDir() {
    return this.stats.isDirectory()
  }

  get attrs() {
    return {
      name: this.name,
      path: this.path,
      isDir: this.isDir,
      children: this.children
        ? this.children.map((child) => child.attrs)
        : null,
    }
  }
}

class QueryFile {
  constructor(public path: string) {}

  read() {
    return fs.readFileSync(this.path, {encoding: "utf-8"})
  }
}

export const index = createOperation("workspaceFiles.index", async () => {
  const workspace = "/Users/jkerr/brimdata/james-query-workspace"
  const entry = new FSEntry(workspace)
  return entry.attrs.children
})

export const show = createOperation(
  "workspaceFiles.show",
  async (_ctx, path: string) => {
    console.log("PATH: ", path)
    const content = new QueryFile(path).read()
    return {content}
  }
)
