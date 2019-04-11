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
          .on("response", (resp) => {
            if (resp.statusCode === 200) {
              resp.pipe(file)
            } else {
              reject(resp.statusMessage)
            }
          })
          .on("error", (e) => {
            reject(e)
          })
          .end()
      })
    })
  })
