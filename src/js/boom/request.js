import http from "http"
import Handler from "./Handler"
import base64 from "../base64"
import trim from "lodash/trim"
import jsonTransform from "./jsonTransform"

export default ({
  host,
  port,
  path,
  method,
  payload,
  user,
  pass,
  stream = true
}) => {
  const handler = new Handler()
  const options = {hostname: host, port, path, method}

  const request = http.request(options, response => {
    response.setEncoding("utf8")

    if (response.statusCode === 200) {
      if (stream) {
        response
          .pipe(jsonTransform())
          .on("data", data => handler.receive(data))
          .on("end", () => handler.onDone())
      } else {
        const messages = []
        response
          .pipe(jsonTransform())
          .on("data", data => messages.push(data))
          .on("end", () => {
            handler.onDone(messages.length === 1 ? messages[0] : messages)
          })
      }
    } else {
      let error = ""
      response.on("data", chunk => (error += chunk))
      response.on("end", () => handler.onError(trim(error)))
    }
  })

  request.setHeader(
    "Authorization",
    `Basic ${base64.encode(`${user}:${pass}`)}`
  )
  request.on("error", error => handler.onError(error.toString()))
  if (payload) request.write(JSON.stringify(payload))
  request.end()

  return handler
}
