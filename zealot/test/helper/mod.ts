import { join } from "https://deno.land/std/path/mod.ts";

export * from "https://deno.land/std/testing/asserts.ts";
export {spy, Spy} from "https://deno.land/x/mock@v0.3.0/spy.ts";
export * from "./test_api.ts";
export * from "./assertCalledWith.ts";

export function test(name: string, fn: () => void | Promise<void>) {
  return Deno.test({
    name,
    fn,
    only: name.startsWith("ONLY"),
  });
}

export function testFile(name: string) {
  return join(Deno.cwd(), "test", "data", name);
}
