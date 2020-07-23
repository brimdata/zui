import { replaceTypes } from "./zngToZeek.ts";
import { assertEquals } from "../test/helper/mod.ts";

Deno.test("convert to int", () => {
  let newTypes = replaceTypes([
    { name: "one", type: "byte" },
    { name: "two", type: "int16" },
    { name: "three", type: "int32" },
    { name: "four", type: "int64" },
    { name: "fiv", type: "uint16" },
    { name: "six", type: "uint32" },
  ]);

  assertEquals(newTypes, [
    { name: "one", type: "int" },
    { name: "two", type: "int" },
    { name: "three", type: "int" },
    { name: "four", type: "int" },
    { name: "fiv", type: "int" },
    { name: "six", type: "int" },
  ]);
});

Deno.test("convert to count", () => {
  assertEquals(replaceTypes([{ name: "one", type: "uint64" }]), [
    { name: "one", type: "count" },
  ]);
});

Deno.test("convert to double", () => {
  assertEquals(replaceTypes([{ name: "one", type: "float64" }]), [
    { name: "one", type: "double" },
  ]);
});

Deno.test("convert to addr", () => {
  assertEquals(replaceTypes([{ name: "one", type: "ip" }]), [
    { name: "one", type: "addr" },
  ]);
});

Deno.test("convert to subnet", () => {
  assertEquals(replaceTypes([{ name: "one", type: "net" }]), [
    { name: "one", type: "subnet" },
  ]);
});

Deno.test("convert to interval", () => {
  assertEquals(replaceTypes([{ name: "one", type: "duration" }]), [
    { name: "one", type: "interval" },
  ]);
});

Deno.test("convert to string", () => {
  assertEquals(replaceTypes([{ name: "one", type: "bstring" }]), [
    { name: "one", type: "string" },
  ]);
});

Deno.test("convert to enum", () => {
  assertEquals(replaceTypes([{ name: "one", type: "zenum" }]), [
    { name: "one", type: "enum" },
  ]);
});

Deno.test("all other types passthrough", () => {
  assertEquals(replaceTypes([{ name: "one", type: "port" }]), [
    { name: "one", type: "port" },
  ]);
});

Deno.test("sets", () => {
  assertEquals(replaceTypes([{ name: "one", type: "set[ip]" }]), [
    { name: "one", type: "set[addr]" },
  ]);
});

Deno.test("array", () => {
  assertEquals(replaceTypes([{ name: "one", type: "array[ip]" }]), [
    { name: "one", type: "array[addr]" },
  ]);
});

Deno.test("nested types", () => {
  let newTypes = replaceTypes([
    {
      name: "id",
      type: [
        { name: "orig_h", type: "ip" },
        { name: "resp_h", type: "ip" },
      ],
    },
    { name: "orig_bytes", type: "uint64" },
  ]);

  assertEquals(newTypes, [
    {
      name: "id",
      type: [
        { name: "orig_h", type: "addr" },
        { name: "resp_h", type: "addr" },
      ],
    },
    { name: "orig_bytes", type: "count" },
  ]);
});
