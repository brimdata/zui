import {readFileSync} from "fs-extra"
import {join} from "path"
import * as config from "test/responses/config"

const cache = {}

export function useResponse(name: string) {
  if (name in cache) return cache[name]

  const {output} = config[name]
  const path = join(__dirname, output)
  const data = readFileSync(path, {encoding: "utf-8"})

  cache[name] = data.split("\n\n\n").map((json) => JSON.parse(json))
  return data
}
