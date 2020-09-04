

import zngToZeekTypes from "./zngToZeekTypes";

test("convert to int", () => {
  let newTypes = zngToZeekTypes([{ name: "one", type: "byte" }, { name: "two", type: "int16" }, { name: "three", type: "int32" }, { name: "four", type: "int64" }, { name: "fiv", type: "uint16" }, { name: "six", type: "uint32" }]);

  expect(newTypes).toEqual([{ name: "one", type: "int" }, { name: "two", type: "int" }, { name: "three", type: "int" }, { name: "four", type: "int" }, { name: "fiv", type: "int" }, { name: "six", type: "int" }]);
});

test("convert to count", () => {
  expect(zngToZeekTypes([{ name: "one", type: "uint64" }])).toEqual([{ name: "one", type: "count" }]);
});

test("convert to double", () => {
  expect(zngToZeekTypes([{ name: "one", type: "float64" }])).toEqual([{ name: "one", type: "double" }]);
});

test("convert to addr", () => {
  expect(zngToZeekTypes([{ name: "one", type: "ip" }])).toEqual([{ name: "one", type: "addr" }]);
});

test("convert to subnet", () => {
  expect(zngToZeekTypes([{ name: "one", type: "net" }])).toEqual([{ name: "one", type: "subnet" }]);
});

test("convert to interval", () => {
  expect(zngToZeekTypes([{ name: "one", type: "duration" }])).toEqual([{ name: "one", type: "interval" }]);
});

test("convert to string", () => {
  expect(zngToZeekTypes([{ name: "one", type: "bstring" }])).toEqual([{ name: "one", type: "string" }]);
});

test("convert to enum", () => {
  expect(zngToZeekTypes([{ name: "one", type: "zenum" }])).toEqual([{ name: "one", type: "enum" }]);
});

test("all other types passthrough", () => {
  expect(zngToZeekTypes([{ name: "one", type: "port" }])).toEqual([{ name: "one", type: "port" }]);
});

test("sets", () => {
  expect(zngToZeekTypes([{ name: "one", type: "set[ip]" }])).toEqual([{ name: "one", type: "set[addr]" }]);
});

test("array", () => {
  expect(zngToZeekTypes([{ name: "one", type: "array[ip]" }])).toEqual([{ name: "one", type: "array[addr]" }]);
});

test("nested types", () => {
  let newTypes = zngToZeekTypes([{
    name: "id",
    type: [{ name: "orig_h", type: "ip" }, { name: "resp_h", type: "ip" }]
  }, { name: "orig_bytes", type: "uint64" }]);

  expect(newTypes).toEqual([{
    name: "id",
    type: [{ name: "orig_h", type: "addr" }, { name: "resp_h", type: "addr" }]
  }, { name: "orig_bytes", type: "count" }]);
});