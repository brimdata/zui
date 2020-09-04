

import Tabs from "../Tabs";
import Viewer from "../Viewer";
import initTestStore from "../../test/initTestStore";

let store;
let tabId;
beforeEach(() => {
  store = initTestStore();
  store.dispatchAll([]);
  tabId = Tabs.getActive(store.getState());
});

let conn = [{ name: "ts", type: "time", value: "1" }];
let dns = [{ name: "ts", type: "time", value: "2" }];
let http = [{ name: "ts", type: "time", value: "3" }];

test("adding logs to the viewer", () => {
  let state = store.dispatchAll([Viewer.appendRecords(tabId, [conn, dns]), Viewer.appendRecords(tabId, [http])]);

  expect(Viewer.getLogs(state).length).toEqual(3);
});

test("clear results", () => {
  let state = store.dispatchAll([Viewer.appendRecords(tabId, [http]), Viewer.clear(tabId)]);

  expect(Viewer.getLogs(state)).toEqual([]);
});

test("splice results", () => {
  let state = store.dispatchAll([Viewer.appendRecords(tabId, [http]), Viewer.appendRecords(tabId, [http]), Viewer.appendRecords(tabId, [http]), Viewer.splice(tabId, 1)]);

  expect(Viewer.getLogs(state).length).toEqual(1);
});

test("results complete", () => {
  let state = store.dispatchAll([Viewer.setEndStatus(tabId, "COMPLETE")]);

  expect(Viewer.getEndStatus(state)).toBe("COMPLETE");
});

test("results incomplete", () => {
  let state = store.dispatchAll([Viewer.setEndStatus(tabId, "INCOMPLETE")]);

  expect(Viewer.getEndStatus(state)).toBe("INCOMPLETE");
});

test("results limited", () => {
  let state = store.dispatchAll([Viewer.setEndStatus(tabId, "LIMIT")]);

  expect(Viewer.getEndStatus(state)).toBe("LIMIT");
});

test("update columns with same tds", () => {
  let cols1 = {
    "9d14c2039a78d76760aae879c7fd2c82": [{ name: "hello", type: "string" }]
  };
  let cols2 = {
    "71f1b421963d31952e15edf7e3957a81": [{ name: "world", type: "string" }]
  };
  let state = store.dispatchAll([Viewer.updateColumns(tabId, cols1), Viewer.updateColumns(tabId, cols2)]);

  expect(Viewer.getColumns(state)).toEqual({
    "9d14c2039a78d76760aae879c7fd2c82": [{ name: "hello", type: "string" }],
    "71f1b421963d31952e15edf7e3957a81": [{ name: "world", type: "string" }]
  });
});