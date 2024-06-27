import {ChildProcessWithoutNullStreams} from "node:child_process"
import {Stream} from "node:stream"
import {isAbortError} from "src/util/is-abort-error"

export function createTransform(sub: ChildProcessWithoutNullStreams) {
  const stream = new Stream.Transform({
    transform(chunk, encoding, callback) {
      if (!sub.stdin.write(chunk, encoding)) {
        sub.stdin.once("drain", callback)
      } else {
        process.nextTick(callback)
      }
    },

    flush(callback) {
      sub.stdin.end()
      if (sub.stdout.destroyed) callback()
      else sub.stdout.on("close", () => callback())
    },
  })
  // Transform stream handlers
  stream.on("error", () => {
    sub.kill("SIGKILL")
  })

  // Sub Hanlers
  sub.on("error", (e) => {
    if (isAbortError(e)) return
    stream.destroy(e)
  })

  // STDIN HANLDERS
  sub.stdin.on("error", (e: Error & {code: string}) => {
    e.code === "EPIPE" ? stream.push(null) : stream.destroy(e)
  })

  // STDOUT HANLDERS
  sub.stdout
    .on("data", (data) => stream.readable && stream.push(data))
    .on("error", (e) => stream.destroy(e))

  // STDERR HANLDERS
  sub.stderr.on("error", (e) => stream.destroy(e))
  return stream
}
