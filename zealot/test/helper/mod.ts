export * from "https://deno.land/std/testing/asserts.ts";
export * from "https://deno.land/x/mock/mod.ts";
export * from "./test_api.ts";
export * from "./assertCalledWith.ts";

export function test(name: string, fn: () => void | Promise<void>) {
  return Deno.test({
    name,
    fn,
    only: name.startsWith("ONLY"),
  });
}
