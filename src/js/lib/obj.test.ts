
import lib from "./";

test("sameKeys empty object", () => {
  expect(lib.obj({}).sameKeys({})).toBe(true);
});

test("sameKeys single nesting objects", () => {
  let a = { name: "james" };
  let b = {};

  expect(lib.obj(a).sameKeys(b)).toBe(false);
});

test("sameKeys single nesting is same", () => {
  let a = { name: "james", age: 22 };
  let b = { name: "phil", age: 23 };

  expect(lib.obj(a).sameKeys(b)).toBe(true);
});

test("sameKeys same number of keys but different", () => {
  let a = { name: "james" };
  let b = { age: 21 };

  expect(lib.obj(a).sameKeys(b)).toBe(false);
});

test("sameKeys nested and the same", () => {
  let a = {
    name: "james",
    address: { street: { line1: "123 Apple", line2: "Apart A" }, state: "CA" }
  };
  let b = {
    name: "billy",
    address: { street: { line1: "982 Bottle", line2: "Apart B" }, state: "NV" }
  };

  expect(lib.obj(a).sameKeys(b)).toBe(true);
});

test("sameKeys nested and different", () => {
  let a = {
    name: "james",
    address: { street: { line1: "123 Apple", line2: "Apart A" }, state: "CA" }
  };
  let b = {
    name: "billy",
    address: { street: { line1: "982 Bottle" }, state: "NV" }
  };

  expect(lib.obj(a).sameKeys(b)).toBe(false);
});