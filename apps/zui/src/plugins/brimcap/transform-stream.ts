import {ChildProcessWithoutNullStreams} from "node:child_process"
import {Stream} from "node:stream"

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
  stream.on("error", () => {
    sub.kill("SIGKILL")
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
