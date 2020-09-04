
import AppError from "../../models/AppError";
import initTestStore from "../../test/initTestStore";
import notice from "./";

let store;
beforeEach(() => {
  store = initTestStore();
});

test("init state", () => {
  let state = store.getState();
  expect(notice.getError(state)).toEqual(null);
  expect(notice.getVisible(state)).toBe(false);
});

test("set an app error", () => {
  let e = new AppError();
  let state = store.dispatchAll([notice.set(e)]);
  let brimError = {
    type: "AppError",
    message: "Unknown error",
    details: []
  };
  expect(notice.getError(state)).toEqual(brimError);
  expect(notice.getVisible(state)).toBe(true);
});

test("set a brim error", () => {
  let brimError = {
    type: "IngestError",
    message: "Pcap is too large to ingest",
    details: ["sort limit reached (10)"]
  };
  let state = store.dispatchAll([notice.set(brimError)]);
  expect(notice.getError(state)).toEqual(brimError);
  expect(notice.getVisible(state)).toBe(true);
});

test("clear", () => {
  let e = new AppError();
  let state = store.dispatchAll([notice.set(e), notice.clear()]);

  expect(notice.getError(state)).toEqual(null);
  expect(notice.getVisible(state)).toBe(true);
});

test("dismiss", () => {
  let e = new AppError();
  let state = store.dispatchAll([notice.set(e), notice.dismiss()]);
  let brimError = {
    type: "AppError",
    message: "Unknown error",
    details: []
  };
  expect(notice.getError(state)).toEqual(brimError);
  expect(notice.getVisible(state)).toBe(false);
});