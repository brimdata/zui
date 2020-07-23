import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {Spy} from "https://deno.land/x/mock/mod.ts";

export function assertCalledWith(spy: Spy<any>, ...args: any) {
   return assertEquals(spy.calls, [{ args: [...args] }]);
}
