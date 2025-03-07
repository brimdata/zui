import fs from "fs"
import path from "path"

export default function file(p: string) {
  return {
    read() {
      return new Promise<any>((good, bad) => {
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
      return this.isDirectory().then((isDir) => {
        return isDir
          ? this.contents()
              .then((files) =>
                Promise.all(files.map((f) => file(path.join(p, f)).allFiles()))
              )
              .then((results) =>
                results.reduce((all, one) => all.concat(one), [])
              )
          : [p]
      })
    },

    isDirectory() {
      return this.stats().then((stats) => stats.isDirectory())
    },

    contents() {
      return new Promise<string[]>((good, bad) => {
        fs.readdir(p, (err, files) => {
          if (err) bad(err)
          else good(files)
        })
      })
    },

    stats() {
      return new Promise<any>((good, bad) => {
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
      return new Promise<void>((good, bad) => {
        fs.writeFile(p, data, (err) => {
          if (err) bad(err)
          else good()
        })
      })
    },

    writeSync(data: string) {
      fs.writeFileSync(p, data)
    },

    remove() {
      return new Promise<void>((good, bad) => {
        fs.unlink(p, (err) => {
          if (err) bad(err)
          else good()
        })
      })
    },

    dirName(): string {
      return path.basename(path.dirname(p))
    },

    fileName(): string {
      return path.basename(p)
    },
  }
}
