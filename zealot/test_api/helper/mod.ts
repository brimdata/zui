import {join} from "https://deno.land/std@0.70.0/path/mod.ts"
export * from "https://deno.land/std@0.70.0/testing/asserts.ts"
export * from "https://deno.land/x/mock@v0.4.0/spy.ts"
export * from "./test_api.ts"
export * from "./assertCalledWith.ts"
export * from "./fake_zqd.ts"
import * as zealot from "../../dist/index.es.js"

export function test(name: string, fn: () => void | Promise<void>) {
  return Deno.test({
    name,
    fn,
    only: name.startsWith("ONLY")
  })
}

export function testFile(name: string) {
  return join(Deno.cwd(), "data", name)
}

export function uniq(things: any[]) {
  let u: any[] = []
  for (let thing of things) {
    if (u.includes(thing)) continue
    u.push(thing)
  }
  return u
}

export const createTime = zealot.createTime
export const createZealot = zealot.createZealot
