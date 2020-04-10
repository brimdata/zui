/* @flow */
import fs from "fs"
import path from "path"

export default function file(p: string) {
  return {
    read() {
      return new Promise<*>((good, bad) => {
        fs.readFile(p, "utf8", (err, data) => {
          if (err) bad(err)
          else good(data)
        })
      })
    },

    readSync() {
      return fs.readFileSync(p, "utf8")
    },

    allFiles() {
      return this.stats().then((stats) => {
        if (stats.isDirectory()) {
          return this.contents()
            .then((files) =>
              Promise.all(files.map((f) => file(path.join(p, f)).allFiles()))
            )
            .then((results) =>
              results.reduce<string[]>((all, one) => all.concat(one), [])
            )
        } else {
          return [p]
        }
      })
    },

    contents() {
      return new Promise<*>((good, bad) => {
        fs.readdir(p, (err, files) => {
          if (err) bad(err)
          else good(files)
        })
      })
    },

    stats() {
      return new Promise<*>((good, bad) => {
        fs.lstat(p, (err, stats) => {
          if (err) bad(err)
          else good(stats)
        })
      })
    },

    statsSync() {
      return fs.lstatSync(p)
    },

    exists() {
      return this.stats()
        .then(() => true)
        .catch(() => false)
    },

    existsSync() {
      try {
        this.statsSync()
        return true
      } catch {
        return false
      }
    },

    write(data: string) {
      return new Promise<*>((good, bad) => {
        fs.writeFile(p, data, (err, val) => {
          if (err) bad(err)
          else good(val)
        })
      })
    },

    remove() {
      return new Promise<*>((good, bad) => {
        fs.unlink(p, (err) => {
          if (err) bad(err)
          else good()
        })
      })
    },

    dirName(): string {
      return path.basename(path.dirname(p))
    }
  }
}
