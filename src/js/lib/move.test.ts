
import lib from "./";

test("moves an item in an array from one index to another", () => {
  let array = ["eggs", "cheese", "ham"];
  let newArray = lib.move(array, 0, 2);

  expect(newArray).toEqual(["cheese", "ham", "eggs"]);
});

test("index is the same", () => {
  let array = ["eggs", "cheese", "ham"];
  let newArray = lib.move(array, 1, 1);

  expect(newArray).toEqual(["eggs", "cheese", "ham"]);
});

test("dest is less than src", () => {
  let array = ["eggs", "cheese", "ham"];
  let newArray = lib.move(array, 2, 1);

  expect(newArray).toEqual(["eggs", "ham", "cheese"]);
});

test("dest is out of bounds", () => {
  let array = ["eggs", "cheese", "ham"];
  let newArray = lib.move(array, 1, 5);

  expect(newArray).toEqual(["eggs", "ham", "cheese"]);
});

test("dest is negative", () => {
  let array = ["eggs", "cheese", "ham"];
  let newArray = lib.move(array, 2, -2);

  expect(newArray).toEqual(["ham", "eggs", "cheese"]);
});