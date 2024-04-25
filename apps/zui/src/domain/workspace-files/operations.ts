import {createOperation} from "src/core/operations"
import fs from "node:fs"
import pathmod from "node:path"
import {cache} from "src/util/cache"
import matter from "gray-matter"

class FSEntry {
  children: FSEntry[] | null = null

  constructor(public path: string, opts: {children?: boolean} = {}) {
    if (this.isDir) {
      if (opts.children) {
        this.children = fs.readdirSync(path).map((name) => {
          return new FSEntry(pathmod.join(path, name))
        })
      } else {
        this.children = []
      }
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
    return matter(fs.readFileSync(this.path, {encoding: "utf-8"}))
  }
}

export const contents = createOperation(
  "workspaceFiles.contents",
  async (_ctx, path: string) => {
    return fs
      .readdirSync(path)
      .map((name) => new FSEntry(pathmod.join(path, name)).attrs)
  }
)

export const read = createOperation(
  "workspaceFiles.read",
  async (_ctx, path: string) => {
    return new QueryFile(path).read()
  }
)
