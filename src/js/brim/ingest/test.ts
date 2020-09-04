
import ingest from "./";

test("one pcap default", () => {
  let data = ingest.getParams([{ type: "pcap", path: "/work/my.pcap" }]);

  expect(data).toEqual({
    dataDir: "",
    name: "my.pcap",
    endpoint: "pcap",
    paths: ["/work/my.pcap"]
  });
});

test("one zeek log default", () => {
  let data = ingest.getParams([{ type: "log", path: "/work/zeek.log" }]);

  expect(data).toEqual({
    name: "zeek.log",
    dataDir: "",
    endpoint: "log",
    paths: ["/work/zeek.log"]
  });
});

test("two zeek logs in same dir default", () => {
  let data = ingest.getParams([{ type: "log", path: "/work/zeek-1.log" }, { type: "log", path: "/work/zeek-2.log" }]);

  expect(data).toEqual({
    name: "work",
    dataDir: "",
    endpoint: "log",
    paths: ["/work/zeek-1.log", "/work/zeek-2.log"]
  });
});

test("two zeek logs in different dir default", () => {
  let data = ingest.getParams([{ type: "log", path: "/work/day-1/zeek.log" }, { type: "log", path: "/work/day-2/zeek.log" }], "", [], new Date(0));

  expect(data).toEqual({
    name: "zeek_1969-12-31_16:00:00",
    dataDir: "",
    endpoint: "log",
    paths: ["/work/day-1/zeek.log", "/work/day-2/zeek.log"]
  });
});

test("two pcaps", () => {
  let data = ingest.getParams([{ type: "pcap", path: "/pcap-1" }, { type: "pcap", path: "/pcap-2" }]);

  expect(data).toEqual({
    error: "Only one pcap can be opened at a time."
  });
});

test("1 pcap and 1 zeek", () => {
  let data = ingest.getParams([{ type: "pcap", path: "/pcap-1" }, { type: "log", path: "/zeek-1" }]);

  expect(data).toEqual({
    error: "Only one pcap can be opened at a time."
  });
});