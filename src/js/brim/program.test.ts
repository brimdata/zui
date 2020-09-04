

import { addHeadProc, getHeadCount, hasHeadOrTailProc, joinParts, parallelizeProcs, splitParts } from "../lib/Program";
import brim from "./";

describe("excluding and including", () => {
  let field = brim.field({ name: "uid", type: "string", value: "123" });

  test("excluding a field", () => {
    let program = brim.program("_path=weird").exclude(field).string();

    expect(program).toEqual('_path=weird uid!="123"');
  });

  test("excluding a field with a pipe", () => {
    let program = brim.program('tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" | sort').exclude(brim.field({ name: "source", type: "string", value: "HTTP" })).string();

    expect(program).toEqual('tx_hosts=2606:4700:30::681c:135e fuid!="F2nyqx46YRDAYe4c73" source!="HTTP" | sort');
  });

  test("excluding a field with two pipes", () => {
    let program = brim.program("_path=weird | sort | filter 1").exclude(field).string();

    expect(program).toEqual('_path=weird uid!="123" | sort | filter 1');
  });

  test("including a field with two pipes", () => {
    let program = brim.program("_path=weird | sort | filter 1").include(field).string();

    expect(program).toEqual('_path=weird uid="123" | sort | filter 1');
  });
});

describe("drill down", () => {
  let result = brim.table().col("id.orig_h", "addr").col("proto", "enum").col("query", "string").col("count", "count").row(["192.168.0.54", "udp", "WPAD", "24"]).toLogs()[0];

  test("when there is no leading filter", () => {
    let program = brim.program("count() by id.orig_h").drillDown(result).string();

    expect(program).toBe("id.orig_h=192.168.0.54");
  });

  test("combines keys in the group by proc", () => {
    let program = brim.program("_path=dns | count() by id.orig_h, proto, query | sort -r").drillDown(result).string();

    expect(program).toBe('_path=dns id.orig_h=192.168.0.54 proto=udp query="WPAD"');
  });

  test("removes *", () => {
    const program = brim.program("* | count() by id.orig_h").drillDown(result).string();

    expect(program).toBe("id.orig_h=192.168.0.54");
  });

  test("easy peasy", () => {
    let program = brim.program("names james | count() by proto").drillDown(result).string();

    expect(program).toBe("names james proto=udp");
  });

  test("count by and filter the same", () => {
    let result = brim.log(["123", "1"], [{ type: "string", name: "md5" }, { type: "count", name: "count" }]);

    let program = brim.program("md5=123 | count() by md5 | sort -r | head 5").drillDown(result).string();

    expect(program).toEqual('md5=123 md5="123"');
  });

  test("filter query", () => {
    let result = brim.log(["9f51ef98c42df4430a978e4157c43dd5", "21"], [{ name: "md5", type: "string" }, { name: "count", type: "count" }]);

    let program = brim.program('_path=files filename!="-" | count() by md5,filename | count() by md5 | sort -r | filter count > 1').drillDown(result).string();

    expect(program).toEqual('_path=files filename!="-" md5="9f51ef98c42df4430a978e4157c43dd5"');
  });
});

describe("count by", () => {
  test("empty program", () => {
    let field = brim.field({ name: "_path", type: "string", value: "conn" });
    let program = brim.program().countBy(field).string();

    expect(program).toBe("| count() by _path");
  });

  test("append a count to an existing query", () => {
    let field = brim.field({ name: "query", type: "string", value: "heyyo" });
    let program = brim.program("dns").countBy(field).string();

    expect(program).toBe("dns | count() by query");
  });
});

describe("sort by", () => {
  test("sort asc does not yet exist", () => {
    let program = brim.program("* | count() by _path").sortBy("count", "asc").string();

    expect(program).toBe("* | count() by _path | sort count");
  });

  test("sort desc does not yet exist", () => {
    let program = brim.program("* | count() by _path").sortBy("count", "desc").string();

    expect(program).toBe("* | count() by _path | sort -r count");
  });

  test("sort asc when one already exists", () => {
    let program = brim.program("* | sort name").sortBy("count", "asc").string();

    expect(program).toBe("* | sort count");
  });

  test("sort desc when one already exists", () => {
    let program = brim.program("* | sort name").sortBy("count", "desc").string();

    expect(program).toBe("* | sort -r count");
  });
});

describe("#hasAnalytics()", () => {
  test("head proc does not have analytics", () => {
    expect(brim.program("* | head 2").hasAnalytics()).toBe(false);
  });

  test("sort proc does not have analytics", () => {
    expect(brim.program("* | sort -r id.resp_p").hasAnalytics()).toBe(false);
  });

  test("every proc does contain analytics", () => {
    expect(brim.program("* | every 1hr count()").hasAnalytics()).toBe(true);
  });

  test("parallel procs when one does have analytics", () => {
    expect(brim.program("* | (every 1hr count(); count() by id.resp_h)").hasAnalytics()).toBe(true);
  });

  test("parallel procs when both do not have analytics", () => {
    expect(brim.program("* | head 100; head 200").hasAnalytics()).toBe(false);
  });

  test("when there are no procs", () => {
    expect(brim.program("*").hasAnalytics()).toBe(false);
  });

  test("for a crappy string", () => {
    expect(brim.program("-r").hasAnalytics()).toBe(false);
  });

  test("for sequential proc", () => {
    expect(brim.program("*google* | head 3 | sort -r id.resp_p").hasAnalytics()).toBe(false);
  });

  test("for cut proc", () => {
    expect(brim.program("* | (cut uid, _path; cut uid) | tail 1").hasAnalytics()).toBe(true);
  });

  test("for filter proc", () => {
    expect(brim.program("* | filter _path=conn").hasAnalytics()).toBe(false);
  });
});

describe("#addHeadProc", () => {
  test("when no head exists", () => {
    expect(addHeadProc("_path=dns", 300)).toBe("_path=dns | head 300");
  });

  test("when head exists", () => {
    expect(addHeadProc("_path=dns | head 45", 300)).toBe("_path=dns | head 45");
  });

  test("when sort exists", () => {
    expect(addHeadProc("_path=dns | sort ts", 300)).toBe("_path=dns | sort ts | head 300");
  });

  test("when sort and head exists", () => {
    expect(addHeadProc("_path=dns | head 23 | sort ts", 300)).toBe("_path=dns | head 23 | sort ts");
  });
});

describe("#getHeadCount", () => {
  test("with one head proc", () => {
    expect(getHeadCount("* | head 1000")).toBe(1000);
  });

  test("with many procs", () => {
    expect(getHeadCount("* | (head 1000; count())")).toBe(1000);
  });

  test("with no head", () => {
    expect(getHeadCount("*")).toBe(0);
  });
});

describe("#hasHeadCount", () => {
  test("#hasHeadCount when false", () => {
    expect(hasHeadOrTailProc("*")).toBe(false);
  });

  test("#hasHeadCount when true", () => {
    expect(hasHeadOrTailProc("* | head 1")).toBe(true);
  });
});

describe("Get Parts of Program", () => {
  let program = "md5=123 _path=files | count() by md5 | sort -r | head 1";

  test("get filter part", () => {
    expect(splitParts(program)[0]).toBe("md5=123 _path=files");
  });

  test("get filter part when none", () => {
    expect(splitParts("* | count()")[0]).toBe("*");
  });

  test("get proc part", () => {
    expect(splitParts(program)[1]).toBe("count() by md5 | sort -r | head 1");
  });

  test("get proc part when none", () => {
    expect(splitParts("_path=files")[1]).toEqual("");
  });
});

describe("Join Parts of Program", () => {
  let filter = "md5=123";
  let proc = "count() by _path";

  test("#joinParts", () => {
    expect(joinParts(filter, proc)).toBe("md5=123 | count() by _path");
  });

  test("#joinParts when empty filter", () => {
    expect(joinParts("", proc)).toBe("* | count() by _path");
  });
});

describe("Parallelizing multiple programs", () => {
  let a = "md5=123 | count()";
  let b = "md5=123 | head 5";
  let c = "md5=123 | count() by _path";

  test("#parallelizeProcs when programs have same filter", () => {
    expect(parallelizeProcs([a, b, c])).toEqual("md5=123 | (count(); head 5; count() by _path)");
  });

  test("#parallelizeProcs when programs do no have same filter", () => {
    expect(() => {
      parallelizeProcs([a, b, c, "_path=conn"]);
    }).toThrow("Filters must be the same in all programs: md5=123, md5=123, md5=123, _path=conn");
  });
});

describe("extracting the first filter", () => {
  test("*", () => {
    expect(brim.program("*").filter()).toEqual("*");
  });

  test("_path=conn", () => {
    expect(brim.program("_path=conn").filter()).toEqual("_path=conn");
  });

  test("_path=conn | sum(duration)", () => {
    expect(brim.program("_path=conn | sum(duration)").filter()).toEqual("_path=conn");
  });

  test("_path=conn | filter a", () => {
    // This is questionable. We'd need another way to extract the filter if we
    // want the result of this to be _path=conn | filter a
    expect(brim.program("_path=conn | filter a").filter()).toEqual("_path=conn");
  });

  test("count()", () => {
    expect(brim.program("count()").filter()).toEqual("*");
  });

  test("dns | count() | filter num > 1", () => {
    expect(brim.program("dns | count() | filter num > 1").filter()).toEqual("dns");
  });
});

describe("cut", () => {
  test("cut some fields", () => {
    expect(brim.program("my filter").cut("ts", "_path").string()).toBe("my filter | cut ts, _path");
  });
});