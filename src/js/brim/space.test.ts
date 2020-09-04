
import brim from "./";
import fixtures from "../test/fixtures";

let space = fixtures("space1");

test("default time span is 30 mins before max time", () => {
  let span = brim.space(space).defaultSpanArgs();
  expect(span).toEqual([{
    sec: 1428915994,
    ns: 0
  }, {
    sec: 1428917794,
    ns: 0
  }]);
});

test("default time span is last 30 minutes if data is recent", () => {
  let recent = { ...space, max_time: brim.time().toTs() };

  expect(brim.space(recent).defaultSpanArgs()).toEqual(["now-30m", "now"]);
});