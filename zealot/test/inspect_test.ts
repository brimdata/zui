import { test, assertEquals } from "./helper/mod.ts";
import { createZealot } from "../zealot.ts";

test("inspect search", () => {
  const zealot = createZealot("test.me");

  const { method, path, body } = zealot.inspect.search(
    "*",
    { spaceId: "1", from: new Date(0), to: new Date(1) },
  );

  assertEquals(method, "POST");
  assertEquals(path, "/search?format=zjson");
  assertEquals(
    body,
    '{"proc":{"op":"FilterProc","filter":{"op":"MatchAll"}},"span":{"ts":{"sec":0,"ns":0},"dur":{"sec":0,"ns":1000000}},"space":"1","dir":-1}',
  );
});
