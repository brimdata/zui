import {spawn} from "child_process"
import os from "os"
import {join} from "path"

// This function should be in it's own package somewhere for all
// to use.

function zqBin() {
  const bin = join(__dirname, "../../../../zdeps/zq")
  return os.platform() === "win32" ? bin + ".exe" : bin
}

function execute(bin: string, opts: string[], input?: string) {
  return new Promise<string>((resolve, reject) => {
    const p = spawn(bin, opts)
      .on("error", (e) => reject(e))
      .on("close", () => resolve(out))

    let out = ""
    p.stdout.on("data", (data: string) => (out += data))
    p.stderr.on("data", (data: string) => (out += data))
    if (input) {
      p.stdin.write(input)
      p.stdin.end()
    }
  })
}

function parseNDJSON(input: string) {
  return input
    .trim()
    .split("\n")
    .map((s) => JSON.parse(s))
}

export async function zq(opts: {
  query?: string
  file?: string
  input?: string
  format?: string
  bin?: string
}): Promise<any> {
  const bin = opts.bin || zqBin()
  const args = []
  if (opts.format) args.push("-f", opts.format)
  if (opts.query) args.push(opts.query)
  if (opts.file) args.push(opts.file)
  else if (opts.input) args.push("-")

  const result = await execute(bin, args, opts.input)
  if (opts.format === "zjson") {
    return parseNDJSON(result)
  } else {
    return result
  }
}
