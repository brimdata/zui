import {readFileSync} from "fs-extra"
import {join} from "path"
import * as config from "test/responses/config"

const cache = {}

/**
 *
 * @param name string key of the object in test/responses/config.ts
 * @returns An array of server responses from zqd as parsed json
 *
 * Example: const response = useResponse("dns")
 *
 * To recreate all the responses saved in the config file:
 *    node scripts/test/responses.js
 */
export function useResponse(name: string) {
  if (name in cache) return cache[name]

  if (!(name in config)) throw new Error(`Unknown response: ${name}`)
  const {output} = config[name]
  const path = join(__dirname, output)
  const data = readFileSync(path, {encoding: "utf-8"})
  cache[name] = data.split("\n\n\n").map((json) => JSON.parse(json))
  return cache[name]
}
