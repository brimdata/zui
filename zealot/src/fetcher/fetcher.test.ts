import "regenerator-runtime/runtime"
import {createFetcher} from "./fetcher"
import http from "http"
import {timeDay} from "d3"

let server: http.Server
beforeEach(() => {
  server = http
    .createServer((req, res) => {
      res.writeHead(200, "OK", {"Access-Control-Allow-Origin": "*"})
      res.write(`{"LogPostResponse": "Hi James"}`)
      res.end()
    })
    .listen(9988)
})

afterEach(() => {
  server.close()
})

test("upload", async () => {
  const fetcher = createFetcher("localhost:9988")
  const file = new File(["x".repeat(1 * 1024 * 1024)], "x-file")
  const fd = new FormData()
  fd.append("file", file)

  const upload = await fetcher.upload({
    path: "/",
    method: "POST",
    body: fd
  })
  expect(await upload.array()).toEqual([{LogPostResponse: "Hi James"}])
})
