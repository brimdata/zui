export default reader =>
  new ReadableStream({
    start(controller) {
      const textDecoder = new TextDecoder("utf-8")
      return reader.read().then(function processStream({value, done}) {
        if (done) {
          controller.close()
          return
        }
        controller.enqueue(textDecoder.decode(value))
        return reader.read().then(processStream)
      })
    }
  })
