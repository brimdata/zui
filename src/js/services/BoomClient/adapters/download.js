/* @flow */

import http from "http"
import fs from "fs"
import {ensureDir} from "fs-extra"
import fspath from "path"

type DownloadArgs = {
  host: string,
  port: number,
  path: string,
  method: string,
  username: string,
  password: string
}

export default (
  {host: hostname, port, path, method, username, password}: DownloadArgs,
  dest: string
) =>
  // $FlowFixMe
  new Promise((resolve, reject) => {
    ensureDir(fspath.dirname(dest), () => {
      const file = fs.createWriteStream(dest)
      file.on("error", reject)
      file.on("finish", () => resolve(dest))
      file.on("open", () => {
        http
          .request({
            hostname,
            port,
            path,
            method,
            auth: `${username}:${password}`
          })
          .on("response", async (resp) => {
            if (resp.statusCode === 200) {
              resp.pipe(file)
            } else {
              reject(await string(resp))
            }
          })
          .on("error", (e) => {
            reject(e)
          })
          .end()
      })
    })
  })

async function string(stream) {
  stream.setEncoding("utf-8")
  let data = ""
  for await (let chunk of stream) {
    data += chunk
  }
  return data
}
