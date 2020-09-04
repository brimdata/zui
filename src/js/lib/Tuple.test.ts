
import * as Tuple from "./Tuple";

const tuple1 = ["1", "conn", "0", "ABC", "foo"];
const tuple2 = ["1", "conn", "0", "ABC", "foo"];
const tuple3 = ["1", "conn", "1", "ABC", "foo"];

test("uniq tuples uses first 4 fields to keep a list uniq", () => {
  expect(Tuple.uniq([tuple1, tuple2, tuple3])).toEqual([tuple1, tuple3]);
});

test("tupleId", () => {
  expect(Tuple.id(tuple1)).toBe("1_conn_0_ABC");
});

test("removeTuple", () => {
  const list = [tuple1, tuple3];
  const removed = Tuple.removeFrom(list, tuple1);
  expect(removed).toEqual([tuple3]);
});