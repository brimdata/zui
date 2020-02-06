/* @flow */
import fs from "fs"
import path from "path"
import {spawn} from "child_process"

class canceler {
  fn: () => void
  cancel = () => this.fn()
  onCancel = (fn: () => void) => (this.fn = fn)
}

function ingest(dst: string, pcaps: Array<string>) {
  const c = new canceler()
  let tmpdir = fs.mkdtempSync("pcapingest")
  let promise = zeek(tmpdir, pcaps, c.onCancel)
    .then(() => {
      return slurp(tmpdir, dst, c.onCancel)
    })
    .finally(() => {
      fs.rmdirSync(tmpdir, {recursive: true})
    })
  return {promise, cancel: c.cancel}
}

function zeek(tmpdir: string, pcaps: Array<string>, onCancel) {
  return new Promise((resolve, reject) => {
    const mergecap = spawn("mergecap", ["-w", "-"].concat(pcaps))
    const zeek = spawn("zeek", ["-r", "-"], {cwd: tmpdir})
    onCancel(() => {
      mergecap.kill()
      reject({reason: "cancelled"})
    })
    mergecap.stdout.pipe(zeek.stdin)
    mergecap.on("error", reject)
    zeek.on("error", reject)
    zeek.on("close", resolve)
  })
}

function slurp(tmpdir: string, dst: string, onCancel) {
  return new Promise((resolve, reject) => {
    const query = "sort -limit 1000000000 ts"
    const files = logfiles(tmpdir)
    const args = ["-f", "bzng", query, ...files]
    const zq = spawn("zq", args)
    zq.stdout.pipe(fs.createWriteStream(path.join(dst, "data.bzng")))
    console.log("hi.promise")
    zq.on("error", reject)
    zq.on("close", resolve)
    onCancel(() => {
      zq.kill()
      console.log("conCancel")
      reject({reason: "cancelled"})
    })
  })
}

function logfiles(dir: string): Array<string> {
  let files = fs.readdirSync(dir, {withFileTypes: true})
  return files.reduce((acc, file) => {
    if (file.isFile()) {
      acc.push(path.join(dir, file.name))
    }
    return acc
  }, [])
}

export default ingest
