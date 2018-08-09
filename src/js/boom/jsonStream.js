const NEW_LINE = "\n\n\n"

export default reader =>
  new ReadableStream({
    start(controller) {
      let leftover = ""

      return reader.read().then(function processStream({value, done}) {
        let start = 0
        let end = 0

        if (done) {
          if (leftover.length >= 2) controller.enqueue(JSON.parse(leftover))
          controller.close()
          return
        }

        const chunk = (leftover += value)

        while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
          const line = chunk.substring(start, end)
          const json = JSON.parse(line)
          controller.enqueue(json)
          start = end + NEW_LINE.length
        }

        leftover = chunk.substring(start)

        return reader.read().then(processStream)
      })
    }
  })
