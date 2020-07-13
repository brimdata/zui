import { assertEquals } from "./helper/mod.ts";
import {createTime} from "../util/time.ts";
import {createSpan} from "../util/span.ts";

Deno.test("Date constructor", () => {
  const t = createTime(new Date(1));

  assertEquals(t.toNs(), 1_000_000n);
});

Deno.test("BigInt constructor", () => {
  const t = createTime(1_000_000n);

  assertEquals(t.toNs(), 1_000_000n);
});

Deno.test("Ts constructor", () => {
  const t = createTime({ sec: 1, ns: 1 });

  assertEquals(t.toNs(), 1_000_000_001n);
});

Deno.test("toTs", () => {
  const t = createTime(4_003_002_001n);

  assertEquals(t.toTs(), { sec: 4, ns: 3_002_001 });
});

Deno.test("toTs back toNs", () => {
  const t = createTime(4_003_002_001n);
  const t2 = createTime(t.toTs());
  assertEquals(t.toNs(), t2.toNs());
});

Deno.test("createSpan", () => {
  const from = new Date(0);
  const to = new Date(1);
  const span = createSpan(from, to);

  assertEquals(span, { ts: { sec: 0, ns: 0 }, dur: { sec: 0, ns: 1000000 } });
});
