import { test, assertThrows, assertEquals } from "./helper/mod.ts";
import { createError } from "../util/error.ts";

test("server error", () => {
  const e = createError({ kind: "Bad", error: "things can happen" });

  assertEquals(e.toString(), "Bad: things can happen");
});

test("object error", () => {
  const e = createError({ boom: "bang" });

  assertEquals(e.boom, "bang");
  assertEquals(e.toString(), "Error");
});

test("Error error", () => {
  const e = createError(new Error("my own error"));

  assertEquals(e.toString(), "Error: my own error");
});

test("string error", () => {
  const e = createError("im a string");

  assertEquals(e.toString(), "Error: im a string");
});

test("null error", () => {
  const e = createError(null);

  assertEquals(e.toString(), "Error: null");
});
