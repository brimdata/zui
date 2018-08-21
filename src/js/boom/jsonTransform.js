import {Transform} from "stream"
const NEW_LINE = "\n\n\n"

export default () => {
  let leftover = ""

  return new Transform({
    readableObjectMode: true,

    transform(value, encoding, callback) {
      let start = 0
      let end = 0
      let chunk = (leftover += value.toString())

      while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
        const line = chunk.substring(start, end)
        const json = JSON.parse(line)
        this.push(json)
        start = end + NEW_LINE.length
      }
      leftover = chunk.substring(start)
      callback()
    },

    flush(callback) {
      if (leftover.length > 0) {
        this.push(JSON.parse(leftover))
      }
      callback()
    }
  })
}
