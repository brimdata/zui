// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("zealot/fetcher/callbacks", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createCallbacks() {
        const callbacks = new Map();
        return {
            add: function (name, cb) {
                callbacks.set(name, cb);
                return this;
            },
            emit: (name, payload) => {
                const cb = callbacks.get(name);
                if (cb)
                    cb(payload);
            },
            start(cb) {
                return this.add("TaskStart", cb);
            },
            end(cb) {
                return this.add("TaskEnd", cb);
            },
            records(cb) {
                return this.add("SearchRecords", cb);
            },
            stats(cb) {
                return this.add("SearchStats", cb);
            },
            warnings(cb) {
                return this.add("SearchWarnings", cb);
            },
            error(cb) {
                return this.add("error", cb);
            },
        };
    }
    exports_1("createCallbacks", createCallbacks);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/fetcher/pipeJson", [], function (exports_2, context_2) {
    "use strict";
    var NEW_LINE;
    var __moduleName = context_2 && context_2.id;
    async function* pipeJson(iterator) {
        let leftover = "";
        for await (let value of iterator) {
            let start = 0;
            let end = 0;
            let chunk = (leftover += value);
            while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
                let line = chunk.substring(start, end);
                yield JSON.parse(line);
                start = end + NEW_LINE.length;
            }
            leftover = chunk.substring(start);
        }
        if (leftover)
            yield JSON.parse(leftover);
    }
    exports_2("pipeJson", pipeJson);
    return {
        setters: [],
        execute: function () {
            NEW_LINE = "\n\n\n";
        }
    };
});
System.register("zealot/fetcher/pipeText", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    async function* pipeText(stream) {
        if (!stream)
            return;
        let reader = stream.getReader();
        let text = new TextDecoder();
        try {
            while (true) {
                let { done, value } = await reader.read();
                if (!done && value) {
                    yield text.decode(value);
                }
                else {
                    return;
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    exports_3("pipeText", pipeText);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/fetcher/contentType", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function parseContentType(resp) {
        const type = resp.headers.get("Content-Type");
        switch (type) {
            case "application/json":
                try {
                    return resp.json();
                }
                catch {
                    console.error("Unable to parse json content, parsing as text instead");
                    return resp.text();
                }
            case "text/html; charset=UTF-8":
            case "text/plain; charset=utf-8":
                return resp.text();
            case "application/vnd.tcpdump.pcap":
                return resp;
            default:
                console.error(`unknown Content-Type: '${type}', parsing as text`);
                return resp.text();
        }
    }
    exports_4("parseContentType", parseContentType);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/fetcher/iterator", ["zealot/util/utils", "zealot/fetcher/pipeJson", "zealot/fetcher/pipeText", "zealot/fetcher/contentType"], function (exports_5, context_5) {
    "use strict";
    var utils_ts_1, pipeJson_ts_1, pipeText_ts_1, contentType_ts_1;
    var __moduleName = context_5 && context_5.id;
    async function* createIterator(resp, args) {
        if (!resp.ok) {
            let contents = await contentType_ts_1.parseContentType(resp);
            if (utils_ts_1.isObject(contents))
                throw contents;
            else
                throw new Error(contents);
        }
        const enhancers = (args.enhancers || []).map((fn) => fn());
        for await (let json of pipeJson_ts_1.pipeJson(pipeText_ts_1.pipeText(resp.body))) {
            yield enhancers.reduce((payload, fn) => fn(payload), json);
        }
    }
    exports_5("createIterator", createIterator);
    return {
        setters: [
            function (utils_ts_1_1) {
                utils_ts_1 = utils_ts_1_1;
            },
            function (pipeJson_ts_1_1) {
                pipeJson_ts_1 = pipeJson_ts_1_1;
            },
            function (pipeText_ts_1_1) {
                pipeText_ts_1 = pipeText_ts_1_1;
            },
            function (contentType_ts_1_1) {
                contentType_ts_1 = contentType_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/fetcher/stream", ["zealot/fetcher/callbacks"], function (exports_6, context_6) {
    "use strict";
    var callbacks_ts_1;
    var __moduleName = context_6 && context_6.id;
    async function emitCallbacks(iterator, callbacks) {
        try {
            for await (const payload of iterator) {
                callbacks.emit(payload.type, payload);
            }
        }
        catch (e) {
            callbacks.emit("error", e);
        }
    }
    function createStream(iterator, origResp) {
        return {
            origResp,
            [Symbol.asyncIterator]: () => iterator,
            array: async () => {
                const all = [];
                for await (const payload of iterator) {
                    all.push(payload);
                }
                return all;
            },
            records: async () => {
                let records = [];
                for await (let payload of iterator) {
                    if (payload.type === "SearchRecords") {
                        records = records.concat(payload.records);
                    }
                }
                return records;
            },
            flatRecords: async () => {
                let records = [];
                for await (let payload of iterator) {
                    if (payload.type === "SearchRecords") {
                        records = records.concat(payload.flat_records);
                    }
                }
                return records;
            },
            callbacks: () => {
                const cbs = callbacks_ts_1.createCallbacks();
                emitCallbacks(iterator, cbs);
                return cbs;
            },
        };
    }
    exports_6("createStream", createStream);
    return {
        setters: [
            function (callbacks_ts_1_1) {
                callbacks_ts_1 = callbacks_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/types", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/util/utils", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function hasOwnProperty(obj, prop) {
        return obj.hasOwnProperty(prop);
    }
    function url(host, path) {
        return `http://${host}${path}`;
    }
    exports_8("url", url);
    function isObject(thing) {
        return typeof thing === "object" && thing !== null;
    }
    exports_8("isObject", isObject);
    function isString(thing) {
        return typeof thing === "string";
    }
    exports_8("isString", isString);
    function isDate(thing) {
        return isObject(thing) && thing.constructor.name === "Date";
    }
    exports_8("isDate", isDate);
    function isNumber(thing) {
        return typeof thing === "number";
    }
    exports_8("isNumber", isNumber);
    function isBigInt(thing) {
        return typeof thing === "bigint";
    }
    exports_8("isBigInt", isBigInt);
    function isFracSec(thing) {
        return isString(thing) && /^\d+\.\d+$/.test(thing);
    }
    exports_8("isFracSec", isFracSec);
    function isTs(thing) {
        return isObject(thing) && hasOwnProperty(thing, "sec") &&
            isNumber(thing.sec) && hasOwnProperty(thing, "ns") && isNumber(thing.ns);
    }
    exports_8("isTs", isTs);
    function uniq(array) {
        const u = [];
        for (const item of array) {
            if (!u.includes(item)) {
                u.push(item);
            }
        }
        return u;
    }
    exports_8("uniq", uniq);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/fetcher/fetcher", ["zealot/util/utils", "zealot/fetcher/contentType", "zealot/fetcher/iterator", "zealot/fetcher/stream"], function (exports_9, context_9) {
    "use strict";
    var utils_ts_2, contentType_ts_2, iterator_ts_1, stream_ts_1;
    var __moduleName = context_9 && context_9.id;
    function createFetcher(host) {
        return {
            async promise(args) {
                const { path, method, body, signal } = args;
                const resp = await fetch(utils_ts_2.url(host, path), { method, body, signal });
                const content = await contentType_ts_2.parseContentType(resp);
                return resp.ok ? content : Promise.reject(content);
            },
            async stream(args) {
                const { path, method, body, signal } = args;
                const resp = await fetch(utils_ts_2.url(host, path), { method, body, signal });
                const iterator = iterator_ts_1.createIterator(resp, args);
                return stream_ts_1.createStream(iterator, resp);
            },
        };
    }
    exports_9("createFetcher", createFetcher);
    return {
        setters: [
            function (utils_ts_2_1) {
                utils_ts_2 = utils_ts_2_1;
            },
            function (contentType_ts_2_1) {
                contentType_ts_2 = contentType_ts_2_1;
            },
            function (iterator_ts_1_1) {
                iterator_ts_1 = iterator_ts_1_1;
            },
            function (stream_ts_1_1) {
                stream_ts_1 = stream_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/config/json_types", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function getDefaultJsonTypeConfig() {
        return {
            "descriptors": {
                "broker_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "ty",
                        "type": "zenum",
                    },
                    {
                        "name": "ev",
                        "type": "bstring",
                    },
                    {
                        "name": "peer",
                        "type": [
                            {
                                "name": "address",
                                "type": "bstring",
                            },
                            {
                                "name": "bound_port",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "message",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "capture_loss_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "ts_delta",
                        "type": "duration",
                    },
                    {
                        "name": "peer",
                        "type": "bstring",
                    },
                    {
                        "name": "gaps",
                        "type": "uint64",
                    },
                    {
                        "name": "acks",
                        "type": "uint64",
                    },
                    {
                        "name": "percent_lost",
                        "type": "float64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "cluster_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "node",
                        "type": "bstring",
                    },
                    {
                        "name": "message",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "config_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "id",
                        "type": "bstring",
                    },
                    {
                        "name": "old_value",
                        "type": "bstring",
                    },
                    {
                        "name": "new_value",
                        "type": "bstring",
                    },
                    {
                        "name": "location",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "conn_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "service",
                        "type": "bstring",
                    },
                    {
                        "name": "duration",
                        "type": "duration",
                    },
                    {
                        "name": "orig_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "resp_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "conn_state",
                        "type": "bstring",
                    },
                    {
                        "name": "local_orig",
                        "type": "bool",
                    },
                    {
                        "name": "local_resp",
                        "type": "bool",
                    },
                    {
                        "name": "missed_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "history",
                        "type": "bstring",
                    },
                    {
                        "name": "orig_pkts",
                        "type": "uint64",
                    },
                    {
                        "name": "orig_ip_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "resp_pkts",
                        "type": "uint64",
                    },
                    {
                        "name": "resp_ip_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "tunnel_parents",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "dce_rpc_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "rtt",
                        "type": "duration",
                    },
                    {
                        "name": "named_pipe",
                        "type": "bstring",
                    },
                    {
                        "name": "endpoint",
                        "type": "bstring",
                    },
                    {
                        "name": "operation",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "dhcp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uids",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "client_addr",
                        "type": "ip",
                    },
                    {
                        "name": "server_addr",
                        "type": "ip",
                    },
                    {
                        "name": "mac",
                        "type": "bstring",
                    },
                    {
                        "name": "host_name",
                        "type": "bstring",
                    },
                    {
                        "name": "client_fqdn",
                        "type": "bstring",
                    },
                    {
                        "name": "domain",
                        "type": "bstring",
                    },
                    {
                        "name": "requested_addr",
                        "type": "ip",
                    },
                    {
                        "name": "assigned_addr",
                        "type": "ip",
                    },
                    {
                        "name": "lease_time",
                        "type": "duration",
                    },
                    {
                        "name": "client_message",
                        "type": "bstring",
                    },
                    {
                        "name": "server_message",
                        "type": "bstring",
                    },
                    {
                        "name": "msg_types",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "duration",
                        "type": "duration",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "dnp3_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "fc_request",
                        "type": "bstring",
                    },
                    {
                        "name": "fc_reply",
                        "type": "bstring",
                    },
                    {
                        "name": "iin",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "dns_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "trans_id",
                        "type": "uint64",
                    },
                    {
                        "name": "rtt",
                        "type": "duration",
                    },
                    {
                        "name": "query",
                        "type": "bstring",
                    },
                    {
                        "name": "qclass",
                        "type": "uint64",
                    },
                    {
                        "name": "qclass_name",
                        "type": "bstring",
                    },
                    {
                        "name": "qtype",
                        "type": "uint64",
                    },
                    {
                        "name": "qtype_name",
                        "type": "bstring",
                    },
                    {
                        "name": "rcode",
                        "type": "uint64",
                    },
                    {
                        "name": "rcode_name",
                        "type": "bstring",
                    },
                    {
                        "name": "AA",
                        "type": "bool",
                    },
                    {
                        "name": "TC",
                        "type": "bool",
                    },
                    {
                        "name": "RD",
                        "type": "bool",
                    },
                    {
                        "name": "RA",
                        "type": "bool",
                    },
                    {
                        "name": "Z",
                        "type": "uint64",
                    },
                    {
                        "name": "answers",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "TTLs",
                        "type": "array[duration]",
                    },
                    {
                        "name": "rejected",
                        "type": "bool",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "dpd_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "analyzer",
                        "type": "bstring",
                    },
                    {
                        "name": "failure_reason",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "files_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "tx_hosts",
                        "type": "set[ip]",
                    },
                    {
                        "name": "rx_hosts",
                        "type": "set[ip]",
                    },
                    {
                        "name": "conn_uids",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "source",
                        "type": "bstring",
                    },
                    {
                        "name": "depth",
                        "type": "uint64",
                    },
                    {
                        "name": "analyzers",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "filename",
                        "type": "bstring",
                    },
                    {
                        "name": "duration",
                        "type": "duration",
                    },
                    {
                        "name": "local_orig",
                        "type": "bool",
                    },
                    {
                        "name": "is_orig",
                        "type": "bool",
                    },
                    {
                        "name": "seen_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "total_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "missing_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "overflow_bytes",
                        "type": "uint64",
                    },
                    {
                        "name": "timedout",
                        "type": "bool",
                    },
                    {
                        "name": "parent_fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "md5",
                        "type": "bstring",
                    },
                    {
                        "name": "sha1",
                        "type": "bstring",
                    },
                    {
                        "name": "sha256",
                        "type": "bstring",
                    },
                    {
                        "name": "extracted",
                        "type": "bstring",
                    },
                    {
                        "name": "extracted_cutoff",
                        "type": "bool",
                    },
                    {
                        "name": "extracted_size",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "ftp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "user",
                        "type": "bstring",
                    },
                    {
                        "name": "password",
                        "type": "bstring",
                    },
                    {
                        "name": "command",
                        "type": "bstring",
                    },
                    {
                        "name": "arg",
                        "type": "bstring",
                    },
                    {
                        "name": "mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "file_size",
                        "type": "uint64",
                    },
                    {
                        "name": "reply_code",
                        "type": "uint64",
                    },
                    {
                        "name": "reply_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "data_channel",
                        "type": [
                            {
                                "name": "passive",
                                "type": "bool",
                            },
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "http_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "trans_depth",
                        "type": "uint64",
                    },
                    {
                        "name": "method",
                        "type": "bstring",
                    },
                    {
                        "name": "host",
                        "type": "bstring",
                    },
                    {
                        "name": "uri",
                        "type": "bstring",
                    },
                    {
                        "name": "referrer",
                        "type": "bstring",
                    },
                    {
                        "name": "version",
                        "type": "bstring",
                    },
                    {
                        "name": "user_agent",
                        "type": "bstring",
                    },
                    {
                        "name": "origin",
                        "type": "bstring",
                    },
                    {
                        "name": "request_body_len",
                        "type": "uint64",
                    },
                    {
                        "name": "response_body_len",
                        "type": "uint64",
                    },
                    {
                        "name": "status_code",
                        "type": "uint64",
                    },
                    {
                        "name": "status_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "info_code",
                        "type": "uint64",
                    },
                    {
                        "name": "info_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "tags",
                        "type": "set[zenum]",
                    },
                    {
                        "name": "username",
                        "type": "bstring",
                    },
                    {
                        "name": "password",
                        "type": "bstring",
                    },
                    {
                        "name": "proxied",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "orig_fuids",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "orig_filenames",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "orig_mime_types",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "resp_fuids",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "resp_filenames",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "resp_mime_types",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "intel_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "seen",
                        "type": [
                            {
                                "name": "indicator",
                                "type": "bstring",
                            },
                            {
                                "name": "indicator_type",
                                "type": "zenum",
                            },
                            {
                                "name": "where",
                                "type": "zenum",
                            },
                            {
                                "name": "node",
                                "type": "bstring",
                            },
                        ],
                    },
                    {
                        "name": "matched",
                        "type": "set[zenum]",
                    },
                    {
                        "name": "sources",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "file_mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "file_desc",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "irc_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "nick",
                        "type": "bstring",
                    },
                    {
                        "name": "user",
                        "type": "bstring",
                    },
                    {
                        "name": "command",
                        "type": "bstring",
                    },
                    {
                        "name": "value",
                        "type": "bstring",
                    },
                    {
                        "name": "addl",
                        "type": "bstring",
                    },
                    {
                        "name": "dcc_file_name",
                        "type": "bstring",
                    },
                    {
                        "name": "dcc_file_size",
                        "type": "uint64",
                    },
                    {
                        "name": "dcc_mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "kerberos_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "request_type",
                        "type": "bstring",
                    },
                    {
                        "name": "client",
                        "type": "bstring",
                    },
                    {
                        "name": "service",
                        "type": "bstring",
                    },
                    {
                        "name": "success",
                        "type": "bool",
                    },
                    {
                        "name": "error_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "from",
                        "type": "time",
                    },
                    {
                        "name": "till",
                        "type": "time",
                    },
                    {
                        "name": "cipher",
                        "type": "bstring",
                    },
                    {
                        "name": "forwardable",
                        "type": "bool",
                    },
                    {
                        "name": "renewable",
                        "type": "bool",
                    },
                    {
                        "name": "client_cert_subject",
                        "type": "bstring",
                    },
                    {
                        "name": "client_cert_fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "server_cert_subject",
                        "type": "bstring",
                    },
                    {
                        "name": "server_cert_fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "known_certs_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "host",
                        "type": "ip",
                    },
                    {
                        "name": "port_num",
                        "type": "port",
                    },
                    {
                        "name": "subject",
                        "type": "bstring",
                    },
                    {
                        "name": "issuer_subject",
                        "type": "bstring",
                    },
                    {
                        "name": "serial",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "known_hosts_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "host",
                        "type": "ip",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "known_services_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "host",
                        "type": "ip",
                    },
                    {
                        "name": "port_num",
                        "type": "port",
                    },
                    {
                        "name": "port_proto",
                        "type": "zenum",
                    },
                    {
                        "name": "service",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "loaded_scripts_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "name",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "modbus_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "func",
                        "type": "bstring",
                    },
                    {
                        "name": "exception",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "mysql_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "cmd",
                        "type": "bstring",
                    },
                    {
                        "name": "arg",
                        "type": "bstring",
                    },
                    {
                        "name": "success",
                        "type": "bool",
                    },
                    {
                        "name": "rows",
                        "type": "uint64",
                    },
                    {
                        "name": "response",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "netcontrol_drop_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "rule_id",
                        "type": "bstring",
                    },
                    {
                        "name": "orig_h",
                        "type": "ip",
                    },
                    {
                        "name": "orig_p",
                        "type": "port",
                    },
                    {
                        "name": "resp_h",
                        "type": "ip",
                    },
                    {
                        "name": "resp_p",
                        "type": "port",
                    },
                    {
                        "name": "expire",
                        "type": "duration",
                    },
                    {
                        "name": "location",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "netcontrol_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "rule_id",
                        "type": "bstring",
                    },
                    {
                        "name": "category",
                        "type": "zenum",
                    },
                    {
                        "name": "cmd",
                        "type": "bstring",
                    },
                    {
                        "name": "state",
                        "type": "zenum",
                    },
                    {
                        "name": "action",
                        "type": "bstring",
                    },
                    {
                        "name": "target",
                        "type": "zenum",
                    },
                    {
                        "name": "entity_type",
                        "type": "bstring",
                    },
                    {
                        "name": "entity",
                        "type": "bstring",
                    },
                    {
                        "name": "mod",
                        "type": "bstring",
                    },
                    {
                        "name": "msg",
                        "type": "bstring",
                    },
                    {
                        "name": "priority",
                        "type": "int64",
                    },
                    {
                        "name": "expire",
                        "type": "duration",
                    },
                    {
                        "name": "location",
                        "type": "bstring",
                    },
                    {
                        "name": "plugin",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "netcontrol_shunt_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "rule_id",
                        "type": "bstring",
                    },
                    {
                        "name": "f",
                        "type": [
                            {
                                "name": "src_h",
                                "type": "ip",
                            },
                            {
                                "name": "src_p",
                                "type": "port",
                            },
                            {
                                "name": "dst_h",
                                "type": "ip",
                            },
                            {
                                "name": "dst_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "expire",
                        "type": "duration",
                    },
                    {
                        "name": "location",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "notice_alarm_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "file_mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "file_desc",
                        "type": "bstring",
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "note",
                        "type": "zenum",
                    },
                    {
                        "name": "msg",
                        "type": "bstring",
                    },
                    {
                        "name": "sub",
                        "type": "bstring",
                    },
                    {
                        "name": "src",
                        "type": "ip",
                    },
                    {
                        "name": "dst",
                        "type": "ip",
                    },
                    {
                        "name": "p",
                        "type": "port",
                    },
                    {
                        "name": "n",
                        "type": "uint64",
                    },
                    {
                        "name": "peer_descr",
                        "type": "bstring",
                    },
                    {
                        "name": "actions",
                        "type": "set[zenum]",
                    },
                    {
                        "name": "suppress_for",
                        "type": "duration",
                    },
                    {
                        "name": "remote_location",
                        "type": [
                            {
                                "name": "country_code",
                                "type": "bstring",
                            },
                            {
                                "name": "region",
                                "type": "bstring",
                            },
                            {
                                "name": "city",
                                "type": "bstring",
                            },
                            {
                                "name": "latitude",
                                "type": "float64",
                            },
                            {
                                "name": "longitude",
                                "type": "float64",
                            },
                        ],
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "notice_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "file_mime_type",
                        "type": "bstring",
                    },
                    {
                        "name": "file_desc",
                        "type": "bstring",
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "note",
                        "type": "zenum",
                    },
                    {
                        "name": "msg",
                        "type": "bstring",
                    },
                    {
                        "name": "sub",
                        "type": "bstring",
                    },
                    {
                        "name": "src",
                        "type": "ip",
                    },
                    {
                        "name": "dst",
                        "type": "ip",
                    },
                    {
                        "name": "p",
                        "type": "port",
                    },
                    {
                        "name": "n",
                        "type": "uint64",
                    },
                    {
                        "name": "peer_descr",
                        "type": "bstring",
                    },
                    {
                        "name": "actions",
                        "type": "set[zenum]",
                    },
                    {
                        "name": "suppress_for",
                        "type": "duration",
                    },
                    {
                        "name": "remote_location",
                        "type": [
                            {
                                "name": "country_code",
                                "type": "bstring",
                            },
                            {
                                "name": "region",
                                "type": "bstring",
                            },
                            {
                                "name": "city",
                                "type": "bstring",
                            },
                            {
                                "name": "latitude",
                                "type": "float64",
                            },
                            {
                                "name": "longitude",
                                "type": "float64",
                            },
                        ],
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "ntlm_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "username",
                        "type": "bstring",
                    },
                    {
                        "name": "hostname",
                        "type": "bstring",
                    },
                    {
                        "name": "domainname",
                        "type": "bstring",
                    },
                    {
                        "name": "server_nb_computer_name",
                        "type": "bstring",
                    },
                    {
                        "name": "server_dns_computer_name",
                        "type": "bstring",
                    },
                    {
                        "name": "server_tree_name",
                        "type": "bstring",
                    },
                    {
                        "name": "success",
                        "type": "bool",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "ntp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "version",
                        "type": "uint64",
                    },
                    {
                        "name": "mode",
                        "type": "uint64",
                    },
                    {
                        "name": "stratum",
                        "type": "uint64",
                    },
                    {
                        "name": "poll",
                        "type": "duration",
                    },
                    {
                        "name": "precision",
                        "type": "duration",
                    },
                    {
                        "name": "root_delay",
                        "type": "duration",
                    },
                    {
                        "name": "root_disp",
                        "type": "duration",
                    },
                    {
                        "name": "ref_id",
                        "type": "bstring",
                    },
                    {
                        "name": "ref_time",
                        "type": "time",
                    },
                    {
                        "name": "org_time",
                        "type": "time",
                    },
                    {
                        "name": "rec_time",
                        "type": "time",
                    },
                    {
                        "name": "xmt_time",
                        "type": "time",
                    },
                    {
                        "name": "num_exts",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "packet_filter_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "node",
                        "type": "bstring",
                    },
                    {
                        "name": "filter",
                        "type": "bstring",
                    },
                    {
                        "name": "init",
                        "type": "bool",
                    },
                    {
                        "name": "success",
                        "type": "bool",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "pe_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "id",
                        "type": "bstring",
                    },
                    {
                        "name": "machine",
                        "type": "bstring",
                    },
                    {
                        "name": "compile_ts",
                        "type": "time",
                    },
                    {
                        "name": "os",
                        "type": "bstring",
                    },
                    {
                        "name": "subsystem",
                        "type": "bstring",
                    },
                    {
                        "name": "is_exe",
                        "type": "bool",
                    },
                    {
                        "name": "is_64bit",
                        "type": "bool",
                    },
                    {
                        "name": "uses_aslr",
                        "type": "bool",
                    },
                    {
                        "name": "uses_dep",
                        "type": "bool",
                    },
                    {
                        "name": "uses_code_integrity",
                        "type": "bool",
                    },
                    {
                        "name": "uses_seh",
                        "type": "bool",
                    },
                    {
                        "name": "has_import_table",
                        "type": "bool",
                    },
                    {
                        "name": "has_export_table",
                        "type": "bool",
                    },
                    {
                        "name": "has_cert_table",
                        "type": "bool",
                    },
                    {
                        "name": "has_debug_data",
                        "type": "bool",
                    },
                    {
                        "name": "section_names",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "radius_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "username",
                        "type": "bstring",
                    },
                    {
                        "name": "mac",
                        "type": "bstring",
                    },
                    {
                        "name": "framed_addr",
                        "type": "ip",
                    },
                    {
                        "name": "tunnel_client",
                        "type": "bstring",
                    },
                    {
                        "name": "connect_info",
                        "type": "bstring",
                    },
                    {
                        "name": "reply_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "result",
                        "type": "bstring",
                    },
                    {
                        "name": "ttl",
                        "type": "duration",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "rdp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "cookie",
                        "type": "bstring",
                    },
                    {
                        "name": "result",
                        "type": "bstring",
                    },
                    {
                        "name": "security_protocol",
                        "type": "bstring",
                    },
                    {
                        "name": "client_channels",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "keyboard_layout",
                        "type": "bstring",
                    },
                    {
                        "name": "client_build",
                        "type": "bstring",
                    },
                    {
                        "name": "client_name",
                        "type": "bstring",
                    },
                    {
                        "name": "client_dig_product_id",
                        "type": "bstring",
                    },
                    {
                        "name": "desktop_width",
                        "type": "uint64",
                    },
                    {
                        "name": "desktop_height",
                        "type": "uint64",
                    },
                    {
                        "name": "requested_color_depth",
                        "type": "bstring",
                    },
                    {
                        "name": "cert_type",
                        "type": "bstring",
                    },
                    {
                        "name": "cert_count",
                        "type": "uint64",
                    },
                    {
                        "name": "cert_permanent",
                        "type": "bool",
                    },
                    {
                        "name": "encryption_level",
                        "type": "bstring",
                    },
                    {
                        "name": "encryption_method",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "reporter_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "level",
                        "type": "zenum",
                    },
                    {
                        "name": "message",
                        "type": "bstring",
                    },
                    {
                        "name": "location",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "rfb_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "client_major_version",
                        "type": "bstring",
                    },
                    {
                        "name": "client_minor_version",
                        "type": "bstring",
                    },
                    {
                        "name": "server_major_version",
                        "type": "bstring",
                    },
                    {
                        "name": "server_minor_version",
                        "type": "bstring",
                    },
                    {
                        "name": "authentication_method",
                        "type": "bstring",
                    },
                    {
                        "name": "auth",
                        "type": "bool",
                    },
                    {
                        "name": "share_flag",
                        "type": "bool",
                    },
                    {
                        "name": "desktop_name",
                        "type": "bstring",
                    },
                    {
                        "name": "width",
                        "type": "uint64",
                    },
                    {
                        "name": "height",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "signatures_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "src_addr",
                        "type": "ip",
                    },
                    {
                        "name": "src_port",
                        "type": "port",
                    },
                    {
                        "name": "dst_addr",
                        "type": "ip",
                    },
                    {
                        "name": "dst_port",
                        "type": "port",
                    },
                    {
                        "name": "note",
                        "type": "zenum",
                    },
                    {
                        "name": "sig_id",
                        "type": "bstring",
                    },
                    {
                        "name": "event_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "sub_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "sig_count",
                        "type": "uint64",
                    },
                    {
                        "name": "host_count",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "sip_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "trans_depth",
                        "type": "uint64",
                    },
                    {
                        "name": "method",
                        "type": "bstring",
                    },
                    {
                        "name": "uri",
                        "type": "bstring",
                    },
                    {
                        "name": "date",
                        "type": "bstring",
                    },
                    {
                        "name": "request_from",
                        "type": "bstring",
                    },
                    {
                        "name": "request_to",
                        "type": "bstring",
                    },
                    {
                        "name": "response_from",
                        "type": "bstring",
                    },
                    {
                        "name": "response_to",
                        "type": "bstring",
                    },
                    {
                        "name": "reply_to",
                        "type": "bstring",
                    },
                    {
                        "name": "call_id",
                        "type": "bstring",
                    },
                    {
                        "name": "seq",
                        "type": "bstring",
                    },
                    {
                        "name": "subject",
                        "type": "bstring",
                    },
                    {
                        "name": "request_path",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "response_path",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "user_agent",
                        "type": "bstring",
                    },
                    {
                        "name": "status_code",
                        "type": "uint64",
                    },
                    {
                        "name": "status_msg",
                        "type": "bstring",
                    },
                    {
                        "name": "warning",
                        "type": "bstring",
                    },
                    {
                        "name": "request_body_len",
                        "type": "uint64",
                    },
                    {
                        "name": "response_body_len",
                        "type": "uint64",
                    },
                    {
                        "name": "content_type",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "smb_files_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "fuid",
                        "type": "bstring",
                    },
                    {
                        "name": "action",
                        "type": "zenum",
                    },
                    {
                        "name": "path",
                        "type": "bstring",
                    },
                    {
                        "name": "name",
                        "type": "bstring",
                    },
                    {
                        "name": "size",
                        "type": "uint64",
                    },
                    {
                        "name": "prev_name",
                        "type": "bstring",
                    },
                    {
                        "name": "times",
                        "type": [
                            {
                                "name": "modified",
                                "type": "time",
                            },
                            {
                                "name": "accessed",
                                "type": "time",
                            },
                            {
                                "name": "created",
                                "type": "time",
                            },
                            {
                                "name": "changed",
                                "type": "time",
                            },
                        ],
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "smb_mapping_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "path",
                        "type": "bstring",
                    },
                    {
                        "name": "service",
                        "type": "bstring",
                    },
                    {
                        "name": "native_file_system",
                        "type": "bstring",
                    },
                    {
                        "name": "share_type",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "smtp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "trans_depth",
                        "type": "uint64",
                    },
                    {
                        "name": "helo",
                        "type": "bstring",
                    },
                    {
                        "name": "mailfrom",
                        "type": "bstring",
                    },
                    {
                        "name": "rcptto",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "date",
                        "type": "bstring",
                    },
                    {
                        "name": "from",
                        "type": "bstring",
                    },
                    {
                        "name": "to",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "cc",
                        "type": "set[bstring]",
                    },
                    {
                        "name": "reply_to",
                        "type": "bstring",
                    },
                    {
                        "name": "msg_id",
                        "type": "bstring",
                    },
                    {
                        "name": "in_reply_to",
                        "type": "bstring",
                    },
                    {
                        "name": "subject",
                        "type": "bstring",
                    },
                    {
                        "name": "x_originating_ip",
                        "type": "ip",
                    },
                    {
                        "name": "first_received",
                        "type": "bstring",
                    },
                    {
                        "name": "second_received",
                        "type": "bstring",
                    },
                    {
                        "name": "last_reply",
                        "type": "bstring",
                    },
                    {
                        "name": "path",
                        "type": "array[ip]",
                    },
                    {
                        "name": "user_agent",
                        "type": "bstring",
                    },
                    {
                        "name": "tls",
                        "type": "bool",
                    },
                    {
                        "name": "fuids",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "is_webmail",
                        "type": "bool",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "snmp_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "duration",
                        "type": "duration",
                    },
                    {
                        "name": "version",
                        "type": "bstring",
                    },
                    {
                        "name": "community",
                        "type": "bstring",
                    },
                    {
                        "name": "get_requests",
                        "type": "uint64",
                    },
                    {
                        "name": "get_bulk_requests",
                        "type": "uint64",
                    },
                    {
                        "name": "get_responses",
                        "type": "uint64",
                    },
                    {
                        "name": "set_requests",
                        "type": "uint64",
                    },
                    {
                        "name": "display_string",
                        "type": "bstring",
                    },
                    {
                        "name": "up_since",
                        "type": "time",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "socks_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "version",
                        "type": "uint64",
                    },
                    {
                        "name": "user",
                        "type": "bstring",
                    },
                    {
                        "name": "password",
                        "type": "bstring",
                    },
                    {
                        "name": "status",
                        "type": "bstring",
                    },
                    {
                        "name": "request",
                        "type": [
                            {
                                "name": "host",
                                "type": "ip",
                            },
                            {
                                "name": "name",
                                "type": "bstring",
                            },
                        ],
                    },
                    {
                        "name": "request_p",
                        "type": "port",
                    },
                    {
                        "name": "bound",
                        "type": [
                            {
                                "name": "host",
                                "type": "ip",
                            },
                            {
                                "name": "name",
                                "type": "bstring",
                            },
                        ],
                    },
                    {
                        "name": "bound_p",
                        "type": "port",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "software_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "host",
                        "type": "ip",
                    },
                    {
                        "name": "host_p",
                        "type": "port",
                    },
                    {
                        "name": "software_type",
                        "type": "zenum",
                    },
                    {
                        "name": "name",
                        "type": "bstring",
                    },
                    {
                        "name": "version",
                        "type": [
                            {
                                "name": "major",
                                "type": "uint64",
                            },
                            {
                                "name": "minor",
                                "type": "uint64",
                            },
                            {
                                "name": "minor2",
                                "type": "uint64",
                            },
                            {
                                "name": "minor3",
                                "type": "uint64",
                            },
                            {
                                "name": "addl",
                                "type": "bstring",
                            },
                        ],
                    },
                    {
                        "name": "unparsed_version",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "ssh_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "version",
                        "type": "uint64",
                    },
                    {
                        "name": "auth_success",
                        "type": "bool",
                    },
                    {
                        "name": "auth_attempts",
                        "type": "uint64",
                    },
                    {
                        "name": "direction",
                        "type": "zenum",
                    },
                    {
                        "name": "client",
                        "type": "bstring",
                    },
                    {
                        "name": "server",
                        "type": "bstring",
                    },
                    {
                        "name": "cipher_alg",
                        "type": "bstring",
                    },
                    {
                        "name": "mac_alg",
                        "type": "bstring",
                    },
                    {
                        "name": "compression_alg",
                        "type": "bstring",
                    },
                    {
                        "name": "kex_alg",
                        "type": "bstring",
                    },
                    {
                        "name": "host_key_alg",
                        "type": "bstring",
                    },
                    {
                        "name": "host_key",
                        "type": "bstring",
                    },
                    {
                        "name": "remote_location",
                        "type": [
                            {
                                "name": "country_code",
                                "type": "bstring",
                            },
                            {
                                "name": "region",
                                "type": "bstring",
                            },
                            {
                                "name": "city",
                                "type": "bstring",
                            },
                            {
                                "name": "latitude",
                                "type": "float64",
                            },
                            {
                                "name": "longitude",
                                "type": "float64",
                            },
                        ],
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "ssl_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "version",
                        "type": "bstring",
                    },
                    {
                        "name": "cipher",
                        "type": "bstring",
                    },
                    {
                        "name": "curve",
                        "type": "bstring",
                    },
                    {
                        "name": "server_name",
                        "type": "bstring",
                    },
                    {
                        "name": "resumed",
                        "type": "bool",
                    },
                    {
                        "name": "last_alert",
                        "type": "bstring",
                    },
                    {
                        "name": "next_protocol",
                        "type": "bstring",
                    },
                    {
                        "name": "established",
                        "type": "bool",
                    },
                    {
                        "name": "cert_chain_fuids",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "client_cert_chain_fuids",
                        "type": "array[bstring]",
                    },
                    {
                        "name": "subject",
                        "type": "bstring",
                    },
                    {
                        "name": "issuer",
                        "type": "bstring",
                    },
                    {
                        "name": "client_subject",
                        "type": "bstring",
                    },
                    {
                        "name": "client_issuer",
                        "type": "bstring",
                    },
                    {
                        "name": "validation_status",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "stats_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "peer",
                        "type": "bstring",
                    },
                    {
                        "name": "mem",
                        "type": "uint64",
                    },
                    {
                        "name": "pkts_proc",
                        "type": "uint64",
                    },
                    {
                        "name": "bytes_recv",
                        "type": "uint64",
                    },
                    {
                        "name": "pkts_dropped",
                        "type": "uint64",
                    },
                    {
                        "name": "pkts_link",
                        "type": "uint64",
                    },
                    {
                        "name": "pkt_lag",
                        "type": "duration",
                    },
                    {
                        "name": "events_proc",
                        "type": "uint64",
                    },
                    {
                        "name": "events_queued",
                        "type": "uint64",
                    },
                    {
                        "name": "active_tcp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "active_udp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "active_icmp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "tcp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "udp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "icmp_conns",
                        "type": "uint64",
                    },
                    {
                        "name": "timers",
                        "type": "uint64",
                    },
                    {
                        "name": "active_timers",
                        "type": "uint64",
                    },
                    {
                        "name": "files",
                        "type": "uint64",
                    },
                    {
                        "name": "active_files",
                        "type": "uint64",
                    },
                    {
                        "name": "dns_requests",
                        "type": "uint64",
                    },
                    {
                        "name": "active_dns_requests",
                        "type": "uint64",
                    },
                    {
                        "name": "reassem_tcp_size",
                        "type": "uint64",
                    },
                    {
                        "name": "reassem_file_size",
                        "type": "uint64",
                    },
                    {
                        "name": "reassem_frag_size",
                        "type": "uint64",
                    },
                    {
                        "name": "reassem_unknown_size",
                        "type": "uint64",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "syslog_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "proto",
                        "type": "zenum",
                    },
                    {
                        "name": "facility",
                        "type": "bstring",
                    },
                    {
                        "name": "severity",
                        "type": "bstring",
                    },
                    {
                        "name": "message",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "tunnel_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "tunnel_type",
                        "type": "zenum",
                    },
                    {
                        "name": "action",
                        "type": "zenum",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "weird_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "uid",
                        "type": "bstring",
                    },
                    {
                        "name": "id",
                        "type": [
                            {
                                "name": "orig_h",
                                "type": "ip",
                            },
                            {
                                "name": "orig_p",
                                "type": "port",
                            },
                            {
                                "name": "resp_h",
                                "type": "ip",
                            },
                            {
                                "name": "resp_p",
                                "type": "port",
                            },
                        ],
                    },
                    {
                        "name": "name",
                        "type": "bstring",
                    },
                    {
                        "name": "addl",
                        "type": "bstring",
                    },
                    {
                        "name": "notice",
                        "type": "bool",
                    },
                    {
                        "name": "peer",
                        "type": "bstring",
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
                "x509_log": [
                    {
                        "name": "_path",
                        "type": "string",
                    },
                    {
                        "name": "ts",
                        "type": "time",
                    },
                    {
                        "name": "id",
                        "type": "bstring",
                    },
                    {
                        "name": "certificate",
                        "type": [
                            {
                                "name": "version",
                                "type": "uint64",
                            },
                            {
                                "name": "serial",
                                "type": "bstring",
                            },
                            {
                                "name": "subject",
                                "type": "bstring",
                            },
                            {
                                "name": "issuer",
                                "type": "bstring",
                            },
                            {
                                "name": "not_valid_before",
                                "type": "time",
                            },
                            {
                                "name": "not_valid_after",
                                "type": "time",
                            },
                            {
                                "name": "key_alg",
                                "type": "bstring",
                            },
                            {
                                "name": "sig_alg",
                                "type": "bstring",
                            },
                            {
                                "name": "key_type",
                                "type": "bstring",
                            },
                            {
                                "name": "key_length",
                                "type": "uint64",
                            },
                            {
                                "name": "exponent",
                                "type": "bstring",
                            },
                            {
                                "name": "curve",
                                "type": "bstring",
                            },
                        ],
                    },
                    {
                        "name": "san",
                        "type": [
                            {
                                "name": "dns",
                                "type": "array[bstring]",
                            },
                            {
                                "name": "uri",
                                "type": "array[bstring]",
                            },
                            {
                                "name": "email",
                                "type": "array[bstring]",
                            },
                            {
                                "name": "ip",
                                "type": "array[ip]",
                            },
                        ],
                    },
                    {
                        "name": "basic_constraints",
                        "type": [
                            {
                                "name": "ca",
                                "type": "bool",
                            },
                            {
                                "name": "path_len",
                                "type": "uint64",
                            },
                        ],
                    },
                    {
                        "name": "_write_ts",
                        "type": "time",
                    },
                ],
            },
            "rules": [
                {
                    "descriptor": "broker_log",
                    "name": "_path",
                    "value": "broker",
                },
                {
                    "descriptor": "capture_loss_log",
                    "name": "_path",
                    "value": "capture_loss",
                },
                {
                    "descriptor": "cluster_log",
                    "name": "_path",
                    "value": "cluster",
                },
                {
                    "descriptor": "config_log",
                    "name": "_path",
                    "value": "config",
                },
                {
                    "descriptor": "conn_log",
                    "name": "_path",
                    "value": "conn",
                },
                {
                    "descriptor": "dce_rpc_log",
                    "name": "_path",
                    "value": "dce_rpc",
                },
                {
                    "descriptor": "dhcp_log",
                    "name": "_path",
                    "value": "dhcp",
                },
                {
                    "descriptor": "dnp3_log",
                    "name": "_path",
                    "value": "dnp3",
                },
                {
                    "descriptor": "dns_log",
                    "name": "_path",
                    "value": "dns",
                },
                {
                    "descriptor": "dpd_log",
                    "name": "_path",
                    "value": "dpd",
                },
                {
                    "descriptor": "files_log",
                    "name": "_path",
                    "value": "files",
                },
                {
                    "descriptor": "ftp_log",
                    "name": "_path",
                    "value": "ftp",
                },
                {
                    "descriptor": "http_log",
                    "name": "_path",
                    "value": "http",
                },
                {
                    "descriptor": "intel_log",
                    "name": "_path",
                    "value": "intel",
                },
                {
                    "descriptor": "irc_log",
                    "name": "_path",
                    "value": "irc",
                },
                {
                    "descriptor": "kerberos_log",
                    "name": "_path",
                    "value": "kerberos",
                },
                {
                    "descriptor": "known_certs_log",
                    "name": "_path",
                    "value": "known_certs",
                },
                {
                    "descriptor": "known_hosts_log",
                    "name": "_path",
                    "value": "known_hosts",
                },
                {
                    "descriptor": "known_services_log",
                    "name": "_path",
                    "value": "known_services",
                },
                {
                    "descriptor": "loaded_scripts_log",
                    "name": "_path",
                    "value": "loaded_scripts",
                },
                {
                    "descriptor": "modbus_log",
                    "name": "_path",
                    "value": "modbus",
                },
                {
                    "descriptor": "mysql_log",
                    "name": "_path",
                    "value": "mysql",
                },
                {
                    "descriptor": "netcontrol_log",
                    "name": "_path",
                    "value": "netcontrol",
                },
                {
                    "descriptor": "netcontrol_drop_log",
                    "name": "_path",
                    "value": "netcontrol_drop",
                },
                {
                    "descriptor": "netcontrol_shunt_log",
                    "name": "_path",
                    "value": "netcontrol_shunt",
                },
                {
                    "descriptor": "notice_log",
                    "name": "_path",
                    "value": "notice",
                },
                {
                    "descriptor": "notice_alarm_log",
                    "name": "_path",
                    "value": "notice_alarm",
                },
                {
                    "descriptor": "ntlm_log",
                    "name": "_path",
                    "value": "ntlm",
                },
                {
                    "descriptor": "ntp_log",
                    "name": "_path",
                    "value": "ntp",
                },
                {
                    "descriptor": "packet_filter_log",
                    "name": "_path",
                    "value": "packet_filter",
                },
                {
                    "descriptor": "pe_log",
                    "name": "_path",
                    "value": "pe",
                },
                {
                    "descriptor": "radius_log",
                    "name": "_path",
                    "value": "radius",
                },
                {
                    "descriptor": "rdp_log",
                    "name": "_path",
                    "value": "rdp",
                },
                {
                    "descriptor": "reporter_log",
                    "name": "_path",
                    "value": "reporter",
                },
                {
                    "descriptor": "rfb_log",
                    "name": "_path",
                    "value": "rfb",
                },
                {
                    "descriptor": "signatures_log",
                    "name": "_path",
                    "value": "signatures",
                },
                {
                    "descriptor": "sip_log",
                    "name": "_path",
                    "value": "sip",
                },
                {
                    "descriptor": "smb_files_log",
                    "name": "_path",
                    "value": "smb_files",
                },
                {
                    "descriptor": "smb_mapping_log",
                    "name": "_path",
                    "value": "smb_mapping",
                },
                {
                    "descriptor": "smtp_log",
                    "name": "_path",
                    "value": "smtp",
                },
                {
                    "descriptor": "snmp_log",
                    "name": "_path",
                    "value": "snmp",
                },
                {
                    "descriptor": "socks_log",
                    "name": "_path",
                    "value": "socks",
                },
                {
                    "descriptor": "software_log",
                    "name": "_path",
                    "value": "software",
                },
                {
                    "descriptor": "ssh_log",
                    "name": "_path",
                    "value": "ssh",
                },
                {
                    "descriptor": "ssl_log",
                    "name": "_path",
                    "value": "ssl",
                },
                {
                    "descriptor": "stats_log",
                    "name": "_path",
                    "value": "stats",
                },
                {
                    "descriptor": "syslog_log",
                    "name": "_path",
                    "value": "syslog",
                },
                {
                    "descriptor": "tunnel_log",
                    "name": "_path",
                    "value": "tunnel",
                },
                {
                    "descriptor": "weird_log",
                    "name": "_path",
                    "value": "weird",
                },
                {
                    "descriptor": "x509_log",
                    "name": "_path",
                    "value": "x509",
                },
            ],
        };
    }
    exports_10("getDefaultJsonTypeConfig", getDefaultJsonTypeConfig);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/api/logs", ["zealot/config/json_types"], function (exports_11, context_11) {
    "use strict";
    var json_types_ts_1;
    var __moduleName = context_11 && context_11.id;
    function getBody(paths, types = json_types_ts_1.getDefaultJsonTypeConfig()) {
        return JSON.stringify({ paths, json_type_config: types });
    }
    return {
        setters: [
            function (json_types_ts_1_1) {
                json_types_ts_1 = json_types_ts_1_1;
            }
        ],
        execute: function () {
            exports_11("default", {
                post({ spaceId, paths, types }) {
                    return {
                        method: "POST",
                        path: `/space/${encodeURIComponent(spaceId)}/log`,
                        body: getBody(paths, types),
                    };
                },
            });
        }
    };
});
System.register("zealot/api/pcaps", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
            exports_12("default", {
                get(args) {
                    const params = new URLSearchParams();
                    params.set("ts_sec", args.ts_sec.toString());
                    params.set("ts_ns", args.ts_ns.toString());
                    params.set("duration_sec", args.duration_sec.toString());
                    params.set("duration_ns", args.duration_ns.toString());
                    params.set("proto", args.proto);
                    params.set("src_host", args.src_host);
                    params.set("src_port", args.src_port);
                    params.set("dst_host", args.dst_host);
                    params.set("dst_port", args.dst_port);
                    const query = params.toString();
                    console.log(`/space/${encodeURIComponent(args.spaceId)}/pcap?${query}`);
                    return {
                        method: "GET",
                        path: `/space/${encodeURIComponent(args.spaceId)}/pcap?${query}`,
                    };
                },
                post({ spaceId, path }) {
                    return {
                        method: "POST",
                        path: `/space/${encodeURIComponent(spaceId)}/pcap`,
                        body: JSON.stringify({ path }),
                    };
                },
            });
        }
    };
});
System.register("node_modules/zq/zql/zql.es", [], function (exports_13, context_13) {
    "use strict";
    var reglob, zql;
    var __moduleName = context_13 && context_13.id;
    function Reglob(glob, opts) {
        if (typeof glob !== 'string') {
            throw new TypeError('Expected a string');
        }
        var str = String(glob);
        var reStr = "";
        var extended = opts ? !!opts.extended : false;
        var globstar = opts ? !!opts.globstar : false;
        var inGroup = false;
        var flags = opts && typeof (opts.flags) === "string" ? opts.flags : "";
        var c;
        for (var i = 0, len = str.length; i < len; i++) {
            c = str[i];
            switch (c) {
                case "/":
                case "$":
                case "^":
                case "+":
                case ".":
                case "(":
                case ")":
                case "=":
                case "!":
                case "|":
                    reStr += "\\" + c;
                    break;
                case "?":
                    if (extended) {
                        reStr += ".";
                        break;
                    }
                case "[":
                case "]":
                    if (extended) {
                        reStr += c;
                        break;
                    }
                case "{":
                    if (extended) {
                        inGroup = true;
                        reStr += "(";
                        break;
                    }
                case "}":
                    if (extended) {
                        inGroup = false;
                        reStr += ")";
                        break;
                    }
                case ",":
                    if (inGroup) {
                        reStr += "|";
                        break;
                    }
                    reStr += "\\" + c;
                    break;
                case '\\':
                    if (str[i + 1] == '*') {
                        i++;
                        reStr += '\\*';
                    }
                    else {
                        reStr += c;
                    }
                    break;
                case "*":
                    var prevChar = str[i - 1];
                    var starCount = 1;
                    while (str[i + 1] === "*") {
                        starCount++;
                        i++;
                    }
                    var nextChar = str[i + 1];
                    if (!globstar) {
                        reStr += ".*";
                    }
                    else {
                        var isGlobstar = starCount > 1
                            && (prevChar === "/" || prevChar === undefined)
                            && (nextChar === "/" || nextChar === undefined);
                        if (isGlobstar) {
                            reStr += "((?:[^/]*(?:\/|$))*)";
                            i++;
                        }
                        else {
                            reStr += "([^/]*)";
                        }
                    }
                    break;
                default:
                    reStr += c;
            }
        }
        if (!flags || !~flags.indexOf('g')) {
            reStr = "^" + reStr + "$";
        }
        return reStr;
    }
    function IsGlobby(s) {
        return (s.indexOf("*") >= 0 || s.indexOf("?") >= 0);
    }
    function peg$subclass(child, parent) {
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    }
    function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
        }
    }
    function peg$parse(input, options) {
        options = options !== void 0 ? options : {};
        var peg$FAILED = {}, peg$startRuleFunctions = { start: peg$parsestart, Expression: peg$parseExpression }, peg$startRuleFunction = peg$parsestart, peg$c0 = function (ast) { return ast; }, peg$c1 = function (procs) {
            let filt = makeFilterProc(makeMatchAll());
            return makeSequentialProc([filt, ...procs]);
        }, peg$c2 = function (s, rest) {
            if (rest.length == 0) {
                return s;
            }
            else {
                return makeSequentialProc([s, ...rest]);
            }
        }, peg$c3 = function (s) {
            return makeSequentialProc([s]);
        }, peg$c4 = function (first, rest) {
            if (rest) {
                return [first, ...rest];
            }
            else {
                return [first];
            }
        }, peg$c5 = "|", peg$c6 = peg$literalExpectation("|", false), peg$c7 = function (p) { return p; }, peg$c8 = function (expr) {
            return makeFilterProc(expr);
        }, peg$c9 = function (first, rest) {
            return makeOrChain(first, rest);
        }, peg$c10 = function (t) { return t; }, peg$c11 = function (first, rest) {
            return makeAndChain(first, rest);
        }, peg$c12 = function (f) { return f; }, peg$c13 = "!", peg$c14 = peg$literalExpectation("!", false), peg$c15 = function (e) {
            return makeLogicalNot(e);
        }, peg$c16 = "-", peg$c17 = peg$literalExpectation("-", false), peg$c18 = function (s) { return s; }, peg$c19 = "(", peg$c20 = peg$literalExpectation("(", false), peg$c21 = ")", peg$c22 = peg$literalExpectation(")", false), peg$c23 = function (expr) { return expr; }, peg$c24 = "*", peg$c25 = peg$literalExpectation("*", false), peg$c26 = function (fieldComparator, v) {
            return makeCompareAny(fieldComparator, false, v);
        }, peg$c27 = "**", peg$c28 = peg$literalExpectation("**", false), peg$c29 = function (fieldComparator, v) {
            return makeCompareAny(fieldComparator, true, v);
        }, peg$c30 = function (f, fieldComparator, v) {
            return makeCompareField(fieldComparator, f, v);
        }, peg$c31 = function (v) {
            return makeCompareAny("in", false, v);
        }, peg$c32 = function (v, f) {
            return makeCompareField("in", f, v);
        }, peg$c33 = function (v) {
            return makeSearch(text(), v, false);
        }, peg$c34 = function (v) {
            return makeSearch(text(), makeLiteral("string", v), true);
        }, peg$c35 = function (i) { return i; }, peg$c36 = function (v) { return v; }, peg$c37 = function (v) {
            return makeLiteral("string", v);
        }, peg$c38 = function (v) {
            return makeLiteral("regexp", v);
        }, peg$c39 = function (v) {
            return makeLiteral("port", v);
        }, peg$c40 = function (v) {
            return makeLiteral("net", v);
        }, peg$c41 = function (v) {
            return makeLiteral("ip", v);
        }, peg$c42 = function (v) {
            return makeLiteral("float64", v);
        }, peg$c43 = function (v) {
            return makeLiteral("int64", v);
        }, peg$c44 = "true", peg$c45 = peg$literalExpectation("true", false), peg$c46 = function () { return makeLiteral("bool", "true"); }, peg$c47 = "false", peg$c48 = peg$literalExpectation("false", false), peg$c49 = function () { return makeLiteral("bool", "false"); }, peg$c50 = "null", peg$c51 = peg$literalExpectation("null", false), peg$c52 = function () { return makeLiteral("null", ""); }, peg$c53 = function (first, rest) {
            let fp = makeSequentialProc(first);
            if (rest) {
                return makeParallelProc([fp, ...rest]);
            }
            else {
                return fp;
            }
        }, peg$c54 = ";", peg$c55 = peg$literalExpectation(";", false), peg$c56 = function (ch) { return makeSequentialProc(ch); }, peg$c57 = function (proc) {
            return proc;
        }, peg$c58 = "by", peg$c59 = peg$literalExpectation("by", true), peg$c60 = ",", peg$c61 = peg$literalExpectation(",", false), peg$c62 = function (first, cl) { return cl; }, peg$c63 = function (first, rest) {
            return makeGroupByKeys(first, rest);
        }, peg$c64 = function (field) { return makeGroupByKey(text(), field); }, peg$c65 = "every", peg$c66 = peg$literalExpectation("every", true), peg$c67 = function (dur) { return dur; }, peg$c68 = "and", peg$c69 = peg$literalExpectation("and", true), peg$c70 = function () { return text(); }, peg$c71 = "or", peg$c72 = peg$literalExpectation("or", true), peg$c73 = "in", peg$c74 = peg$literalExpectation("in", true), peg$c75 = "not", peg$c76 = peg$literalExpectation("not", true), peg$c77 = /^[A-Za-z_$]/, peg$c78 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", "$"], false, false), peg$c79 = /^[0-9]/, peg$c80 = peg$classExpectation([["0", "9"]], false, false), peg$c81 = ".", peg$c82 = peg$literalExpectation(".", false), peg$c83 = function (base, field) { return makeFieldCall("RecordFieldRead", null, field); }, peg$c84 = "[", peg$c85 = peg$literalExpectation("[", false), peg$c86 = "]", peg$c87 = peg$literalExpectation("]", false), peg$c88 = function (base, index) { return makeFieldCall("Index", null, index); }, peg$c89 = function (base, derefs) {
            return chainFieldCalls(base, derefs);
        }, peg$c90 = function (op, field) {
            return makeFieldCall(op, field, null);
        }, peg$c91 = "len", peg$c92 = peg$literalExpectation("len", true), peg$c93 = function () { return "Len"; }, peg$c94 = function (first, rest) {
            let result = [first];
            for (let r of rest) {
                result.push(r[3]);
            }
            return result;
        }, peg$c95 = function (base, refs) { return text(); }, peg$c96 = function (first, ref) { return ref; }, peg$c97 = function (first, rest) {
            let result = [first];
            for (let r of rest) {
                result.push(r);
            }
            return result;
        }, peg$c99 = "count", peg$c100 = peg$literalExpectation("count", true), peg$c101 = function () { return "Count"; }, peg$c102 = "sum", peg$c103 = peg$literalExpectation("sum", true), peg$c104 = function () { return "Sum"; }, peg$c105 = "avg", peg$c106 = peg$literalExpectation("avg", true), peg$c107 = function () { return "Avg"; }, peg$c108 = "stdev", peg$c109 = peg$literalExpectation("stdev", true), peg$c110 = function () { return "Stdev"; }, peg$c111 = "sd", peg$c112 = peg$literalExpectation("sd", true), peg$c113 = "var", peg$c114 = peg$literalExpectation("var", true), peg$c115 = function () { return "Var"; }, peg$c116 = "entropy", peg$c117 = peg$literalExpectation("entropy", true), peg$c118 = function () { return "Entropy"; }, peg$c119 = "min", peg$c120 = peg$literalExpectation("min", true), peg$c121 = function () { return "Min"; }, peg$c122 = "max", peg$c123 = peg$literalExpectation("max", true), peg$c124 = function () { return "Max"; }, peg$c125 = "first", peg$c126 = peg$literalExpectation("first", true), peg$c127 = function () { return "First"; }, peg$c128 = "last", peg$c129 = peg$literalExpectation("last", true), peg$c130 = function () { return "Last"; }, peg$c131 = "countdistinct", peg$c132 = peg$literalExpectation("countdistinct", true), peg$c133 = function () { return "CountDistinct"; }, peg$c134 = function (field) { return field; }, peg$c135 = function (op, field) {
            return makeReducer(op, "count", field);
        }, peg$c136 = function (op, field) {
            return makeReducer(op, toLowerCase(op), field);
        }, peg$c137 = function (every, reducers, keys, limit) {
            if (OR(keys, every)) {
                if (keys) {
                    keys = keys[1];
                }
                else {
                    keys = [];
                }
                if (every) {
                    every = every[0];
                }
                return makeGroupByProc(every, limit, keys, reducers);
            }
            return makeReduceProc(reducers);
        }, peg$c138 = "=", peg$c139 = peg$literalExpectation("=", false), peg$c140 = function (field, f) {
            return overrideReducerVar(f, field);
        }, peg$c141 = function (first, rest) {
            let result = [first];
            for (let r of rest) {
                result.push(r[3]);
            }
            return result;
        }, peg$c142 = "sort", peg$c143 = peg$literalExpectation("sort", true), peg$c144 = function (args, l) { return l; }, peg$c145 = function (args, list) {
            return makeSortProc(args, list);
        }, peg$c146 = function (a) { return a; }, peg$c147 = "-r", peg$c148 = peg$literalExpectation("-r", false), peg$c149 = function () { return makeArg("r", null); }, peg$c150 = "-nulls", peg$c151 = peg$literalExpectation("-nulls", false), peg$c152 = peg$literalExpectation("first", false), peg$c153 = peg$literalExpectation("last", false), peg$c154 = function (where) { return makeArg("nulls", where); }, peg$c155 = "top", peg$c156 = peg$literalExpectation("top", true), peg$c157 = function (n) { return n; }, peg$c158 = "-flush", peg$c159 = peg$literalExpectation("-flush", false), peg$c160 = function (limit, flush, f) { return f; }, peg$c161 = function (limit, flush, list) {
            return makeTopProc(list, limit, flush);
        }, peg$c162 = "-limit", peg$c163 = peg$literalExpectation("-limit", false), peg$c164 = function (limit) { return limit; }, peg$c165 = "-c", peg$c166 = peg$literalExpectation("-c", false), peg$c167 = function () { return makeArg("c", null); }, peg$c168 = "cut", peg$c169 = peg$literalExpectation("cut", true), peg$c170 = function (arg, list) { return makeCutProc(arg, list); }, peg$c171 = "head", peg$c172 = peg$literalExpectation("head", true), peg$c173 = function (count) { return makeHeadProc(count); }, peg$c174 = function () { return makeHeadProc(1); }, peg$c175 = "tail", peg$c176 = peg$literalExpectation("tail", true), peg$c177 = function (count) { return makeTailProc(count); }, peg$c178 = function () { return makeTailProc(1); }, peg$c179 = "filter", peg$c180 = peg$literalExpectation("filter", true), peg$c181 = "uniq", peg$c182 = peg$literalExpectation("uniq", true), peg$c183 = function () {
            return makeUniqProc(true);
        }, peg$c184 = function () {
            return makeUniqProc(false);
        }, peg$c185 = "put", peg$c186 = peg$literalExpectation("put", true), peg$c187 = function (first, rest) {
            return makePutProc(first, rest);
        }, peg$c188 = function (f, e) {
            return makeAssignment(f, e);
        }, peg$c189 = function (f) {
            return chainFieldCalls(f, []);
        }, peg$c190 = "?", peg$c191 = peg$literalExpectation("?", false), peg$c192 = ":", peg$c193 = peg$literalExpectation(":", false), peg$c194 = function (condition, thenClause, elseClause) {
            return makeConditionalExpr(condition, thenClause, elseClause);
        }, peg$c195 = function (first, rest) {
            return makeBinaryExprChain(first, rest);
        }, peg$c196 = "=~", peg$c197 = peg$literalExpectation("=~", false), peg$c198 = "!~", peg$c199 = peg$literalExpectation("!~", false), peg$c200 = "!=", peg$c201 = peg$literalExpectation("!=", false), peg$c202 = peg$literalExpectation("in", false), peg$c203 = "<=", peg$c204 = peg$literalExpectation("<=", false), peg$c205 = "<", peg$c206 = peg$literalExpectation("<", false), peg$c207 = ">=", peg$c208 = peg$literalExpectation(">=", false), peg$c209 = ">", peg$c210 = peg$literalExpectation(">", false), peg$c211 = "+", peg$c212 = peg$literalExpectation("+", false), peg$c213 = "/", peg$c214 = peg$literalExpectation("/", false), peg$c215 = function (e) {
            return makeUnaryExpr("!", e);
        }, peg$c216 = function (e, ct) { return ct; }, peg$c217 = function (e, t) {
            if (t) {
                return makeCastExpression(e, t);
            }
            else {
                return e;
            }
        }, peg$c218 = "bool", peg$c219 = peg$literalExpectation("bool", false), peg$c220 = "byte", peg$c221 = peg$literalExpectation("byte", false), peg$c222 = "int16", peg$c223 = peg$literalExpectation("int16", false), peg$c224 = "uint16", peg$c225 = peg$literalExpectation("uint16", false), peg$c226 = "int32", peg$c227 = peg$literalExpectation("int32", false), peg$c228 = "uint32", peg$c229 = peg$literalExpectation("uint32", false), peg$c230 = "int64", peg$c231 = peg$literalExpectation("int64", false), peg$c232 = "uint64", peg$c233 = peg$literalExpectation("uint64", false), peg$c234 = "float64", peg$c235 = peg$literalExpectation("float64", false), peg$c236 = "string", peg$c237 = peg$literalExpectation("string", false), peg$c238 = "bstring", peg$c239 = peg$literalExpectation("bstring", false), peg$c240 = "ip", peg$c241 = peg$literalExpectation("ip", false), peg$c242 = "net", peg$c243 = peg$literalExpectation("net", false), peg$c244 = "time", peg$c245 = peg$literalExpectation("time", false), peg$c246 = "duration", peg$c247 = peg$literalExpectation("duration", false), peg$c248 = function (fn, args) {
            return makeFunctionCall(fn, args);
        }, peg$c249 = /^[A-Za-z]/, peg$c250 = peg$classExpectation([["A", "Z"], ["a", "z"]], false, false), peg$c251 = /^[.0-9]/, peg$c252 = peg$classExpectation([".", ["0", "9"]], false, false), peg$c253 = function (first, e) { return e; }, peg$c254 = function (first, rest) {
            return [first, ...rest];
        }, peg$c255 = function () { return []; }, peg$c256 = function (base, field) { return makeLiteral("string", text()); }, peg$c257 = function (base, derefs) {
            return makeBinaryExprChain(base, derefs);
        }, peg$c258 = peg$literalExpectation("and", false), peg$c259 = "seconds", peg$c260 = peg$literalExpectation("seconds", false), peg$c261 = "second", peg$c262 = peg$literalExpectation("second", false), peg$c263 = "secs", peg$c264 = peg$literalExpectation("secs", false), peg$c265 = "sec", peg$c266 = peg$literalExpectation("sec", false), peg$c267 = "s", peg$c268 = peg$literalExpectation("s", false), peg$c269 = "minutes", peg$c270 = peg$literalExpectation("minutes", false), peg$c271 = "minute", peg$c272 = peg$literalExpectation("minute", false), peg$c273 = "mins", peg$c274 = peg$literalExpectation("mins", false), peg$c275 = peg$literalExpectation("min", false), peg$c276 = "m", peg$c277 = peg$literalExpectation("m", false), peg$c278 = "hours", peg$c279 = peg$literalExpectation("hours", false), peg$c280 = "hrs", peg$c281 = peg$literalExpectation("hrs", false), peg$c282 = "hr", peg$c283 = peg$literalExpectation("hr", false), peg$c284 = "h", peg$c285 = peg$literalExpectation("h", false), peg$c286 = "hour", peg$c287 = peg$literalExpectation("hour", false), peg$c288 = "days", peg$c289 = peg$literalExpectation("days", false), peg$c290 = "day", peg$c291 = peg$literalExpectation("day", false), peg$c292 = "d", peg$c293 = peg$literalExpectation("d", false), peg$c294 = "weeks", peg$c295 = peg$literalExpectation("weeks", false), peg$c296 = "week", peg$c297 = peg$literalExpectation("week", false), peg$c298 = "wks", peg$c299 = peg$literalExpectation("wks", false), peg$c300 = "wk", peg$c301 = peg$literalExpectation("wk", false), peg$c302 = "w", peg$c303 = peg$literalExpectation("w", false), peg$c304 = function () { return makeDuration(1); }, peg$c305 = function (num) { return makeDuration(num); }, peg$c306 = function () { return makeDuration(60); }, peg$c307 = function (num) { return makeDuration(num * 60); }, peg$c308 = function () { return makeDuration(3600); }, peg$c309 = function (num) { return makeDuration(num * 3600); }, peg$c310 = function () { return makeDuration(3600 * 24); }, peg$c311 = function (num) { return makeDuration(num * 3600 * 24); }, peg$c312 = function (num) { return makeDuration(num * 3600 * 24 * 7); }, peg$c313 = function (a) { return text(); }, peg$c314 = function (a, b) {
            return joinChars(a) + b;
        }, peg$c315 = "::", peg$c316 = peg$literalExpectation("::", false), peg$c317 = function (a, b, d, e) {
            return a + joinChars(b) + "::" + joinChars(d) + e;
        }, peg$c318 = function (a, b) {
            return "::" + joinChars(a) + b;
        }, peg$c319 = function (a, b) {
            return a + joinChars(b) + "::";
        }, peg$c320 = function () {
            return "::";
        }, peg$c321 = function (v) { return ":" + v; }, peg$c322 = function (v) { return v + ":"; }, peg$c323 = function (a, m) {
            return a + "/" + m.toString();
        }, peg$c324 = function (a, m) {
            return a + "/" + m;
        }, peg$c325 = function (s) { return parseInt(s); }, peg$c326 = /^[+\-]/, peg$c327 = peg$classExpectation(["+", "-"], false, false), peg$c329 = function () {
            return text();
        }, peg$c330 = "0", peg$c331 = peg$literalExpectation("0", false), peg$c332 = /^[1-9]/, peg$c333 = peg$classExpectation([["1", "9"]], false, false), peg$c334 = "e", peg$c335 = peg$literalExpectation("e", true), peg$c336 = function (chars) { return text(); }, peg$c337 = /^[0-9a-fA-F]/, peg$c338 = peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false), peg$c339 = function (chars) { return joinChars(chars); }, peg$c340 = "\\", peg$c341 = peg$literalExpectation("\\", false), peg$c342 = /^[\0-\x1F\\(),!><="|';]/, peg$c343 = peg$classExpectation([["\0", "\x1F"], "\\", "(", ")", ",", "!", ">", "<", "=", "\"", "|", "'", ";"], false, false), peg$c344 = peg$anyExpectation(), peg$c345 = "\"", peg$c346 = peg$literalExpectation("\"", false), peg$c347 = function (v) { return joinChars(v); }, peg$c348 = "'", peg$c349 = peg$literalExpectation("'", false), peg$c350 = "x", peg$c351 = peg$literalExpectation("x", false), peg$c352 = function () { return "\\" + text(); }, peg$c353 = "b", peg$c354 = peg$literalExpectation("b", false), peg$c355 = function () { return "\b"; }, peg$c356 = "f", peg$c357 = peg$literalExpectation("f", false), peg$c358 = function () { return "\f"; }, peg$c359 = "n", peg$c360 = peg$literalExpectation("n", false), peg$c361 = function () { return "\n"; }, peg$c362 = "r", peg$c363 = peg$literalExpectation("r", false), peg$c364 = function () { return "\r"; }, peg$c365 = "t", peg$c366 = peg$literalExpectation("t", false), peg$c367 = function () { return "\t"; }, peg$c368 = "v", peg$c369 = peg$literalExpectation("v", false), peg$c370 = function () { return "\v"; }, peg$c371 = function () { return "="; }, peg$c372 = function () { return "\\*"; }, peg$c373 = "u", peg$c374 = peg$literalExpectation("u", false), peg$c375 = function (chars) {
            return makeUnicodeChar(chars);
        }, peg$c376 = "{", peg$c377 = peg$literalExpectation("{", false), peg$c378 = "}", peg$c379 = peg$literalExpectation("}", false), peg$c380 = /^[^\/\\]/, peg$c381 = peg$classExpectation(["/", "\\"], true, false), peg$c382 = "\\/", peg$c383 = peg$literalExpectation("\\/", false), peg$c384 = /^[\0-\x1F\\]/, peg$c385 = peg$classExpectation([["\0", "\x1F"], "\\"], false, false), peg$c386 = "\t", peg$c387 = peg$literalExpectation("\t", false), peg$c388 = "\x0B", peg$c389 = peg$literalExpectation("\x0B", false), peg$c390 = "\f", peg$c391 = peg$literalExpectation("\f", false), peg$c392 = " ", peg$c393 = peg$literalExpectation(" ", false), peg$c394 = "\xA0", peg$c395 = peg$literalExpectation("\xA0", false), peg$c396 = "\uFEFF", peg$c397 = peg$literalExpectation("\uFEFF", false), peg$c398 = peg$otherExpectation("whitespace"), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
        if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
                throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }
            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }
        function text() {
            return input.substring(peg$savedPos, peg$currPos);
        }
        function peg$literalExpectation(text, ignoreCase) {
            return { type: "literal", text: text, ignoreCase: ignoreCase };
        }
        function peg$classExpectation(parts, inverted, ignoreCase) {
            return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
        }
        function peg$anyExpectation() {
            return { type: "any" };
        }
        function peg$endExpectation() {
            return { type: "end" };
        }
        function peg$otherExpectation(description) {
            return { type: "other", description: description };
        }
        function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos], p;
            if (details) {
                return details;
            }
            else {
                p = pos - 1;
                while (!peg$posDetailsCache[p]) {
                    p--;
                }
                details = peg$posDetailsCache[p];
                details = {
                    line: details.line,
                    column: details.column
                };
                while (p < pos) {
                    if (input.charCodeAt(p) === 10) {
                        details.line++;
                        details.column = 1;
                    }
                    else {
                        details.column++;
                    }
                    p++;
                }
                peg$posDetailsCache[pos] = details;
                return details;
            }
        }
        function peg$computeLocation(startPos, endPos) {
            var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
            return {
                start: {
                    offset: startPos,
                    line: startPosDetails.line,
                    column: startPosDetails.column
                },
                end: {
                    offset: endPos,
                    line: endPosDetails.line,
                    column: endPosDetails.column
                }
            };
        }
        function peg$fail(expected) {
            if (peg$currPos < peg$maxFailPos) {
                return;
            }
            if (peg$currPos > peg$maxFailPos) {
                peg$maxFailPos = peg$currPos;
                peg$maxFailExpected = [];
            }
            peg$maxFailExpected.push(expected);
        }
        function peg$buildStructuredError(expected, found, location) {
            return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
        }
        function peg$parsestart() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsequery();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseEOF();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c0(s2);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsequery() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parseprocChain();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c1(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsesearch();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$parsechainedProc();
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$parsechainedProc();
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c2(s1, s3);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsesearch();
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c3(s1);
                    }
                    s0 = s1;
                }
            }
            return s0;
        }
        function peg$parseprocChain() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseproc();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsechainedProc();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsechainedProc();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c4(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsechainedProc() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 124) {
                    s2 = peg$c5;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c6);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseproc();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c7(s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesearch() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsesearchExpr();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c8(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsesearchExpr() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsesearchTerm();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseoredSearchTerm();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseoredSearchTerm();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c9(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseoredSearchTerm() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseorToken();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parsesearchTerm();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c10(s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesearchTerm() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsesearchFactor();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseandedSearchTerm();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseandedSearchTerm();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseandedSearchTerm() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseandToken();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsesearchFactor();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c12(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesearchFactor() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parsenotToken();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 33) {
                    s2 = peg$c13;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c14);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsesearchExpr();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c15(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 45) {
                    s2 = peg$c16;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c17);
                    }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = void 0;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parsesearchPred();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c18(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s1 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsesearchExpr();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                        s5 = peg$c21;
                                        peg$currPos++;
                                    }
                                    else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c22);
                                        }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c23(s3);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsesearchPred() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c24;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c25);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseequalityToken();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsesearchValue();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c26(s3, s5);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c27) {
                    s1 = peg$c27;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c28);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseequalityToken();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsesearchValue();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c29(s3, s5);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsefieldExpr();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseequalityToken();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsesearchValue();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c30(s1, s3, s5);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parsesearchValue();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse_();
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseinToken();
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parse_();
                                    if (s4 === peg$FAILED) {
                                        s4 = null;
                                    }
                                    if (s4 !== peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 42) {
                                            s5 = peg$c24;
                                            peg$currPos++;
                                        }
                                        else {
                                            s5 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c25);
                                            }
                                        }
                                        if (s5 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c31(s1);
                                            s0 = s1;
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parsesearchValue();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse_();
                                if (s2 === peg$FAILED) {
                                    s2 = null;
                                }
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseinToken();
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parse_();
                                        if (s4 === peg$FAILED) {
                                            s4 = null;
                                        }
                                        if (s4 !== peg$FAILED) {
                                            s5 = peg$parsefieldReference();
                                            if (s5 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c32(s1, s5);
                                                s0 = s1;
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parsesearchLiteral();
                                if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c33(s1);
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$currPos;
                                    peg$silentFails++;
                                    s2 = peg$currPos;
                                    s3 = peg$parsesearchKeywords();
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parse_();
                                        if (s4 !== peg$FAILED) {
                                            s3 = [s3, s4];
                                            s2 = s3;
                                        }
                                        else {
                                            peg$currPos = s2;
                                            s2 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s2;
                                        s2 = peg$FAILED;
                                    }
                                    peg$silentFails--;
                                    if (s2 === peg$FAILED) {
                                        s1 = void 0;
                                    }
                                    else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                    if (s1 !== peg$FAILED) {
                                        s2 = peg$parsesearchWord();
                                        if (s2 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c34(s2);
                                            s0 = s1;
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesearchLiteral() {
            var s0, s1, s2, s3, s4;
            s0 = peg$parseStringLiteral();
            if (s0 === peg$FAILED) {
                s0 = peg$parseRegexpLiteral();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsePortLiteral();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseSubnetLiteral();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseAddressLiteral();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseFloatLiteral();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$parseIntegerLiteral();
                                    if (s1 !== peg$FAILED) {
                                        s2 = peg$currPos;
                                        peg$silentFails++;
                                        s3 = peg$parsesearchWord();
                                        peg$silentFails--;
                                        if (s3 === peg$FAILED) {
                                            s2 = void 0;
                                        }
                                        else {
                                            peg$currPos = s2;
                                            s2 = peg$FAILED;
                                        }
                                        if (s2 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c35(s1);
                                            s0 = s1;
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        s1 = peg$currPos;
                                        peg$silentFails++;
                                        s2 = peg$currPos;
                                        s3 = peg$parsesearchKeywords();
                                        if (s3 !== peg$FAILED) {
                                            s4 = peg$parse_();
                                            if (s4 !== peg$FAILED) {
                                                s3 = [s3, s4];
                                                s2 = s3;
                                            }
                                            else {
                                                peg$currPos = s2;
                                                s2 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s2;
                                            s2 = peg$FAILED;
                                        }
                                        peg$silentFails--;
                                        if (s2 === peg$FAILED) {
                                            s1 = void 0;
                                        }
                                        else {
                                            peg$currPos = s1;
                                            s1 = peg$FAILED;
                                        }
                                        if (s1 !== peg$FAILED) {
                                            s2 = peg$parseBooleanLiteral();
                                            if (s2 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c36(s2);
                                                s0 = s1;
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            s1 = peg$currPos;
                                            peg$silentFails++;
                                            s2 = peg$currPos;
                                            s3 = peg$parsesearchKeywords();
                                            if (s3 !== peg$FAILED) {
                                                s4 = peg$parse_();
                                                if (s4 !== peg$FAILED) {
                                                    s3 = [s3, s4];
                                                    s2 = s3;
                                                }
                                                else {
                                                    peg$currPos = s2;
                                                    s2 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s2;
                                                s2 = peg$FAILED;
                                            }
                                            peg$silentFails--;
                                            if (s2 === peg$FAILED) {
                                                s1 = void 0;
                                            }
                                            else {
                                                peg$currPos = s1;
                                                s1 = peg$FAILED;
                                            }
                                            if (s1 !== peg$FAILED) {
                                                s2 = peg$parseNullLiteral();
                                                if (s2 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c36(s2);
                                                    s0 = s1;
                                                }
                                                else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesearchValue() {
            var s0, s1, s2, s3, s4;
            s0 = peg$parsesearchLiteral();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                s2 = peg$currPos;
                s3 = peg$parsesearchKeywords();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = void 0;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parsesearchWord();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c37(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseStringLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsequotedString();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c37(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseRegexpLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsereString();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c38(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsePortLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseport();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseSubnetLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseip6subnet();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c40(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsesubnet();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c40(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseAddressLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseip6addr();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c41(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseaddr();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c41(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseFloatLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsesdouble();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c42(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseIntegerLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsesinteger();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c43(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseBooleanLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c44) {
                s1 = peg$c44;
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c45);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 5) === peg$c47) {
                    s1 = peg$c47;
                    peg$currPos += 5;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c48);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c49();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseNullLiteral() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c50) {
                s1 = peg$c50;
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c51);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c52();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsesearchKeywords() {
            var s0;
            s0 = peg$parseandToken();
            if (s0 === peg$FAILED) {
                s0 = peg$parseorToken();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseinToken();
                }
            }
            return s0;
        }
        function peg$parseprocList() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseprocChain();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseparallelChain();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseparallelChain();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c53(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseparallelChain() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                    s2 = peg$c54;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c55);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseprocChain();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c56(s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parsesimpleProc();
            if (s0 === peg$FAILED) {
                s0 = peg$parsereduceProc();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s1 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseprocList();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse_();
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                        s5 = peg$c21;
                                        peg$currPos++;
                                    }
                                    else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c22);
                                        }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c57(s3);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsegroupByKeys() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c58) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c59);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsegroupByKey();
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 44) {
                                s7 = peg$c60;
                                peg$currPos++;
                            }
                            else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c61);
                                }
                            }
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parsegroupByKey();
                                    if (s9 !== peg$FAILED) {
                                        peg$savedPos = s5;
                                        s6 = peg$c62(s3, s9);
                                        s5 = s6;
                                    }
                                    else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 44) {
                                    s7 = peg$c60;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c61);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parsegroupByKey();
                                        if (s9 !== peg$FAILED) {
                                            peg$savedPos = s5;
                                            s6 = peg$c62(s3, s9);
                                            s5 = s6;
                                        }
                                        else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c63(s3, s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsegroupByKey() {
            var s0, s1;
            s0 = peg$parseAssignment();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsefieldExpr();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseeveryDur() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c65) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c66);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseduration();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c67(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseequalityToken() {
            var s0;
            s0 = peg$parseEqualityOperator();
            if (s0 === peg$FAILED) {
                s0 = peg$parseRelativeOperator();
            }
            return s0;
        }
        function peg$parseandToken() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c68) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c69);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseorToken() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c71) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c72);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseinToken() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c73) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c74);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsenotToken() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c75) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c76);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsefieldName() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsefieldNameStart();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsefieldNameRest();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsefieldNameRest();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefieldNameStart() {
            var s0;
            if (peg$c77.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c78);
                }
            }
            return s0;
        }
        function peg$parsefieldNameRest() {
            var s0;
            s0 = peg$parsefieldNameStart();
            if (s0 === peg$FAILED) {
                if (peg$c79.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c80);
                    }
                }
            }
            return s0;
        }
        function peg$parsefieldReference() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            s1 = peg$parsefieldName();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c81;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c82);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsefieldName();
                    if (s5 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c83(s1, s5);
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 91) {
                        s4 = peg$c84;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c85);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsesuint();
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 93) {
                                s6 = peg$c86;
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c87);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                peg$savedPos = s3;
                                s4 = peg$c88(s1, s5);
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s4 = peg$c81;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c82);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsefieldName();
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c83(s1, s5);
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 91) {
                            s4 = peg$c84;
                            peg$currPos++;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c85);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsesuint();
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 93) {
                                    s6 = peg$c86;
                                    peg$currPos++;
                                }
                                else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c87);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    peg$savedPos = s3;
                                    s4 = peg$c88(s1, s5);
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c89(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefieldExpr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsefieldOp();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsefieldReference();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                        s7 = peg$c21;
                                        peg$currPos++;
                                    }
                                    else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c22);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c90(s1, s5);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsefieldReference();
            }
            return s0;
        }
        function peg$parsefieldOp() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c91) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c92);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c93();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsefieldExprList() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsefieldExpr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                    s4 = null;
                }
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s5 = peg$c60;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c61);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 === peg$FAILED) {
                            s6 = null;
                        }
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsefieldExpr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 === peg$FAILED) {
                        s4 = null;
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s5 = peg$c60;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c61);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 === peg$FAILED) {
                                s6 = null;
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsefieldExpr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c94(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefieldRefDotOnly() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsefieldName();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c81;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c82);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsefieldName();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s4 = peg$c81;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c82);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsefieldName();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c95();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefieldRefDotOnlyList() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsefieldRefDotOnly();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                    s4 = null;
                }
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s5 = peg$c60;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c61);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 === peg$FAILED) {
                            s6 = null;
                        }
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsefieldRefDotOnly();
                            if (s7 !== peg$FAILED) {
                                peg$savedPos = s3;
                                s4 = peg$c96(s1, s7);
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 === peg$FAILED) {
                        s4 = null;
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s5 = peg$c60;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c61);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 === peg$FAILED) {
                                s6 = null;
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsefieldRefDotOnly();
                                if (s7 !== peg$FAILED) {
                                    peg$savedPos = s3;
                                    s4 = peg$c96(s1, s7);
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c97(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecountOp() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c99) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c100);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c101();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsefieldReducerOp() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c102) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c103);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c104();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 3).toLowerCase() === peg$c105) {
                    s1 = input.substr(peg$currPos, 3);
                    peg$currPos += 3;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c106);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c107();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 5).toLowerCase() === peg$c108) {
                        s1 = input.substr(peg$currPos, 5);
                        peg$currPos += 5;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c109);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c110();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2).toLowerCase() === peg$c111) {
                            s1 = input.substr(peg$currPos, 2);
                            peg$currPos += 2;
                        }
                        else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c112);
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c110();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c113) {
                                s1 = input.substr(peg$currPos, 3);
                                peg$currPos += 3;
                            }
                            else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c114);
                                }
                            }
                            if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c115();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.substr(peg$currPos, 7).toLowerCase() === peg$c116) {
                                    s1 = input.substr(peg$currPos, 7);
                                    peg$currPos += 7;
                                }
                                else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c117);
                                    }
                                }
                                if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c118();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c119) {
                                        s1 = input.substr(peg$currPos, 3);
                                        peg$currPos += 3;
                                    }
                                    else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c120);
                                        }
                                    }
                                    if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c121();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.substr(peg$currPos, 3).toLowerCase() === peg$c122) {
                                            s1 = input.substr(peg$currPos, 3);
                                            peg$currPos += 3;
                                        }
                                        else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c123);
                                            }
                                        }
                                        if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c124();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c125) {
                                                s1 = input.substr(peg$currPos, 5);
                                                peg$currPos += 5;
                                            }
                                            else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c126);
                                                }
                                            }
                                            if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c127();
                                            }
                                            s0 = s1;
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                if (input.substr(peg$currPos, 4).toLowerCase() === peg$c128) {
                                                    s1 = input.substr(peg$currPos, 4);
                                                    peg$currPos += 4;
                                                }
                                                else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c129);
                                                    }
                                                }
                                                if (s1 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c130();
                                                }
                                                s0 = s1;
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.substr(peg$currPos, 13).toLowerCase() === peg$c131) {
                                                        s1 = input.substr(peg$currPos, 13);
                                                        peg$currPos += 13;
                                                    }
                                                    else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c132);
                                                        }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c133();
                                                    }
                                                    s0 = s1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsepaddedFieldExpr() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsefieldExpr();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c134(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecountReducer() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            s1 = peg$parsecountOp();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parsepaddedFieldExpr();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse_();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s6 = peg$c21;
                                    peg$currPos++;
                                }
                                else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c22);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c135(s1, s4);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefieldReducer() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsefieldReducerOp();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsefieldExpr();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 41) {
                                        s7 = peg$c21;
                                        peg$currPos++;
                                    }
                                    else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c22);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c136(s1, s5);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereduceProc() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseeveryDur();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsereducerList();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsegroupByKeys();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseprocLimitArg();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c137(s1, s2, s3, s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereducerExpr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsefieldName();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s3 = peg$c138;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c139);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsereducer();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c140(s1, s5);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsereducer();
            }
            return s0;
        }
        function peg$parsereducer() {
            var s0;
            s0 = peg$parsecountReducer();
            if (s0 === peg$FAILED) {
                s0 = peg$parsefieldReducer();
            }
            return s0;
        }
        function peg$parsereducerList() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsereducerExpr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                    s4 = null;
                }
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s5 = peg$c60;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c61);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 === peg$FAILED) {
                            s6 = null;
                        }
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsereducerExpr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 === peg$FAILED) {
                        s4 = null;
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s5 = peg$c60;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c61);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 === peg$FAILED) {
                                s6 = null;
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsereducerExpr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c141(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesimpleProc() {
            var s0;
            s0 = peg$parsesort();
            if (s0 === peg$FAILED) {
                s0 = peg$parsetop();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsecut();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsehead();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsetail();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsefilter();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseuniq();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseput();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesort() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c142) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c143);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsesortArgs();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsefieldExprList();
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c144(s2, s5);
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c145(s2, s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesortArgs() {
            var s0, s1, s2, s3;
            s0 = [];
            s1 = peg$currPos;
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parsesortArg();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s2 = peg$c146(s3);
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$currPos;
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsesortArg();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s1;
                        s2 = peg$c146(s3);
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsesortArg() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c147) {
                s1 = peg$c147;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c148);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c149();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 6) === peg$c150) {
                    s1 = peg$c150;
                    peg$currPos += 6;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c151);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        if (input.substr(peg$currPos, 5) === peg$c125) {
                            s4 = peg$c125;
                            peg$currPos += 5;
                        }
                        else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c152);
                            }
                        }
                        if (s4 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c128) {
                                s4 = peg$c128;
                                peg$currPos += 4;
                            }
                            else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c153);
                                }
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c70();
                        }
                        s3 = s4;
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c154(s3);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsetop() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c155) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c156);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseunsignedInteger();
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c157(s4);
                        s2 = s3;
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c158) {
                            s5 = peg$c158;
                            peg$currPos += 6;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c159);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parsefieldExprList();
                            if (s6 !== peg$FAILED) {
                                peg$savedPos = s4;
                                s5 = peg$c160(s2, s3, s6);
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c161(s2, s3, s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseprocLimitArg() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c162) {
                    s2 = peg$c162;
                    peg$currPos += 6;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c163);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseunsignedInteger();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c164(s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecutArg() {
            var s0, s1, s2, s3;
            s0 = [];
            s1 = peg$currPos;
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c165) {
                    s3 = peg$c165;
                    peg$currPos += 2;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c166);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s2 = peg$c167();
                    s1 = s2;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$currPos;
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c165) {
                        s3 = peg$c165;
                        peg$currPos += 2;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c166);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s1;
                        s2 = peg$c167();
                        s1 = s2;
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsecut() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c168) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c169);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsecutArg();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parsefieldRefDotOnlyList();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c170(s2, s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsehead() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c171) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c172);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseunsignedInteger();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c173(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4).toLowerCase() === peg$c171) {
                    s1 = input.substr(peg$currPos, 4);
                    peg$currPos += 4;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c172);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c174();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsetail() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c175) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c176);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseunsignedInteger();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c177(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4).toLowerCase() === peg$c175) {
                    s1 = input.substr(peg$currPos, 4);
                    peg$currPos += 4;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c176);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c178();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsefilter() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c179) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c180);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsesearchExpr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c8(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseuniq() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c181) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c182);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c165) {
                        s3 = peg$c165;
                        peg$currPos += 2;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c166);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c183();
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4).toLowerCase() === peg$c181) {
                    s1 = input.substr(peg$currPos, 4);
                    peg$currPos += 4;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c182);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c184();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseput() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c185) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c186);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseAssignment();
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 44) {
                                s7 = peg$c60;
                                peg$currPos++;
                            }
                            else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c61);
                                }
                            }
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parseAssignment();
                                    if (s9 !== peg$FAILED) {
                                        peg$savedPos = s5;
                                        s6 = peg$c62(s3, s9);
                                        s5 = s6;
                                    }
                                    else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 44) {
                                    s7 = peg$c60;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c61);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parseAssignment();
                                        if (s9 !== peg$FAILED) {
                                            peg$savedPos = s5;
                                            s6 = peg$c62(s3, s9);
                                            s5 = s6;
                                        }
                                        else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c187(s3, s4);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseAssignment() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsefieldName();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s3 = peg$c138;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c139);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseConditionalExpression();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c188(s1, s5);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsePrimaryExpression() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parseStringLiteral();
            if (s0 === peg$FAILED) {
                s0 = peg$parseRegexpLiteral();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsePortLiteral();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseSubnetLiteral();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseAddressLiteral();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseFloatLiteral();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseIntegerLiteral();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseBooleanLiteral();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseNullLiteral();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$parseFieldReference();
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.charCodeAt(peg$currPos) === 40) {
                                                        s1 = peg$c19;
                                                        peg$currPos++;
                                                    }
                                                    else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c20);
                                                        }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                        s2 = peg$parse__();
                                                        if (s2 !== peg$FAILED) {
                                                            s3 = peg$parseConditionalExpression();
                                                            if (s3 !== peg$FAILED) {
                                                                s4 = peg$parse__();
                                                                if (s4 !== peg$FAILED) {
                                                                    if (input.charCodeAt(peg$currPos) === 41) {
                                                                        s5 = peg$c21;
                                                                        peg$currPos++;
                                                                    }
                                                                    else {
                                                                        s5 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c22);
                                                                        }
                                                                    }
                                                                    if (s5 !== peg$FAILED) {
                                                                        peg$savedPos = s0;
                                                                        s1 = peg$c23(s3);
                                                                        s0 = s1;
                                                                    }
                                                                    else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseFieldReference() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsefieldName();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c189(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseExpression() {
            var s0;
            s0 = peg$parseConditionalExpression();
            return s0;
        }
        function peg$parseConditionalExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseLogicalORExpression();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 63) {
                        s3 = peg$c190;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c191);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseConditionalExpression();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 58) {
                                        s7 = peg$c192;
                                        peg$currPos++;
                                    }
                                    else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c193);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseConditionalExpression();
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c194(s1, s5, s9);
                                                s0 = s1;
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseLogicalORExpression();
            }
            return s0;
        }
        function peg$parseLogicalORExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseLogicalANDExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseorToken();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseLogicalANDExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseorToken();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseLogicalANDExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseLogicalANDExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseEqualityCompareExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseandToken();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseEqualityCompareExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseandToken();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseEqualityCompareExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseEqualityCompareExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseRelativeExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseEqualityComparator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseRelativeExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseEqualityComparator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseRelativeExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseEqualityOperator() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c196) {
                s1 = peg$c196;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c197);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c198) {
                    s1 = peg$c198;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c199);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s1 = peg$c138;
                        peg$currPos++;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c139);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c200) {
                            s1 = peg$c200;
                            peg$currPos += 2;
                        }
                        else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c201);
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseEqualityComparator() {
            var s0, s1;
            s0 = peg$parseEqualityOperator();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c73) {
                    s1 = peg$c73;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c202);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseRelativeExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseAdditiveExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseRelativeOperator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseAdditiveExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseRelativeOperator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseAdditiveExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseRelativeOperator() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c203) {
                s1 = peg$c203;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c204);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 60) {
                    s1 = peg$c205;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c206);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c207) {
                        s1 = peg$c207;
                        peg$currPos += 2;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c208);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 62) {
                            s1 = peg$c209;
                            peg$currPos++;
                        }
                        else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c210);
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseAdditiveExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseMultiplicativeExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseAdditiveOperator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseMultiplicativeExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseAdditiveOperator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseMultiplicativeExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseAdditiveOperator() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 43) {
                s1 = peg$c211;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c212);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                    s1 = peg$c16;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c17);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseMultiplicativeExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseNotExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseMultiplicativeOperator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseNotExpression();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseMultiplicativeOperator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseNotExpression();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c195(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseMultiplicativeOperator() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c24;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c25);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                    s1 = peg$c213;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c214);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseNotExpression() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 33) {
                s1 = peg$c13;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c14);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseNotExpression();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c215(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseCastExpression();
            }
            return s0;
        }
        function peg$parseCastExpression() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            s1 = peg$parseCallExpression();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 58) {
                        s4 = peg$c192;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c193);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse__();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseZngType();
                            if (s6 !== peg$FAILED) {
                                peg$savedPos = s2;
                                s3 = peg$c216(s1, s6);
                                s2 = s3;
                            }
                            else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c217(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseZngType() {
            var s0;
            if (input.substr(peg$currPos, 4) === peg$c218) {
                s0 = peg$c218;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c219);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c220) {
                    s0 = peg$c220;
                    peg$currPos += 4;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c221);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c222) {
                        s0 = peg$c222;
                        peg$currPos += 5;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c223);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c224) {
                            s0 = peg$c224;
                            peg$currPos += 6;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c225);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c226) {
                                s0 = peg$c226;
                                peg$currPos += 5;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c227);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c228) {
                                    s0 = peg$c228;
                                    peg$currPos += 6;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c229);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c230) {
                                        s0 = peg$c230;
                                        peg$currPos += 5;
                                    }
                                    else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c231);
                                        }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 6) === peg$c232) {
                                            s0 = peg$c232;
                                            peg$currPos += 6;
                                        }
                                        else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c233);
                                            }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 7) === peg$c234) {
                                                s0 = peg$c234;
                                                peg$currPos += 7;
                                            }
                                            else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c235);
                                                }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 6) === peg$c236) {
                                                    s0 = peg$c236;
                                                    peg$currPos += 6;
                                                }
                                                else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c237);
                                                    }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 7) === peg$c238) {
                                                        s0 = peg$c238;
                                                        peg$currPos += 7;
                                                    }
                                                    else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c239);
                                                        }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 2) === peg$c240) {
                                                            s0 = peg$c240;
                                                            peg$currPos += 2;
                                                        }
                                                        else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c241);
                                                            }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 3) === peg$c242) {
                                                                s0 = peg$c242;
                                                                peg$currPos += 3;
                                                            }
                                                            else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c243);
                                                                }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 4) === peg$c244) {
                                                                    s0 = peg$c244;
                                                                    peg$currPos += 4;
                                                                }
                                                                else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c245);
                                                                    }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 8) === peg$c246) {
                                                                        s0 = peg$c246;
                                                                        peg$currPos += 8;
                                                                    }
                                                                    else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c247);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseCallExpression() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseFunctionName();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c19;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseArgumentList();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                                s5 = peg$c21;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c22);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c248(s1, s4);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseDereferenceExpression();
            }
            return s0;
        }
        function peg$parseFunctionName() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseFunctionNameStart();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseFunctionNameRest();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseFunctionNameRest();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseFunctionNameStart() {
            var s0;
            if (peg$c249.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c250);
                }
            }
            return s0;
        }
        function peg$parseFunctionNameRest() {
            var s0;
            s0 = peg$parseFunctionNameStart();
            if (s0 === peg$FAILED) {
                if (peg$c251.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c252);
                    }
                }
            }
            return s0;
        }
        function peg$parseArgumentList() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseConditionalExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s5 = peg$c60;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c61);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseConditionalExpression();
                            if (s7 !== peg$FAILED) {
                                peg$savedPos = s3;
                                s4 = peg$c253(s1, s7);
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s5 = peg$c60;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c61);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseConditionalExpression();
                                if (s7 !== peg$FAILED) {
                                    peg$savedPos = s3;
                                    s4 = peg$c253(s1, s7);
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c254(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse__();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c255();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseDereferenceExpression() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parsePrimaryExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 91) {
                        s5 = peg$c84;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c85);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseConditionalExpression();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 93) {
                                        s9 = peg$c86;
                                        peg$currPos++;
                                    }
                                    else {
                                        s9 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c87);
                                        }
                                    }
                                    if (s9 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7, s8, s9];
                                        s3 = s4;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 46) {
                            s5 = peg$c81;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c82);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$currPos;
                                s8 = peg$parsefieldName();
                                if (s8 !== peg$FAILED) {
                                    peg$savedPos = s7;
                                    s8 = peg$c256();
                                }
                                s7 = s8;
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 91) {
                            s5 = peg$c84;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c85);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseConditionalExpression();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 93) {
                                            s9 = peg$c86;
                                            peg$currPos++;
                                        }
                                        else {
                                            s9 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c87);
                                            }
                                        }
                                        if (s9 !== peg$FAILED) {
                                            s4 = [s4, s5, s6, s7, s8, s9];
                                            s3 = s4;
                                        }
                                        else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 46) {
                                s5 = peg$c81;
                                peg$currPos++;
                            }
                            else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c82);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$currPos;
                                    s8 = peg$parsefieldName();
                                    if (s8 !== peg$FAILED) {
                                        peg$savedPos = s7;
                                        s8 = peg$c256();
                                    }
                                    s7 = s8;
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c257(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseduration() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parseseconds();
            if (s0 === peg$FAILED) {
                s0 = peg$parseminutes();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsehours();
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parsehours();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse_();
                            if (s2 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c68) {
                                    s3 = peg$c68;
                                    peg$currPos += 3;
                                }
                                else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c258);
                                    }
                                }
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parse_();
                                    if (s4 !== peg$FAILED) {
                                        s5 = peg$parseminutes();
                                        if (s5 !== peg$FAILED) {
                                            s1 = [s1, s2, s3, s4, s5];
                                            s0 = s1;
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsedays();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseweeks();
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesec_abbrev() {
            var s0;
            if (input.substr(peg$currPos, 7) === peg$c259) {
                s0 = peg$c259;
                peg$currPos += 7;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c260);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c261) {
                    s0 = peg$c261;
                    peg$currPos += 6;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c262);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c263) {
                        s0 = peg$c263;
                        peg$currPos += 4;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c264);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c265) {
                            s0 = peg$c265;
                            peg$currPos += 3;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c266);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 115) {
                                s0 = peg$c267;
                                peg$currPos++;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c268);
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsemin_abbrev() {
            var s0;
            if (input.substr(peg$currPos, 7) === peg$c269) {
                s0 = peg$c269;
                peg$currPos += 7;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c270);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c271) {
                    s0 = peg$c271;
                    peg$currPos += 6;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c272);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c273) {
                        s0 = peg$c273;
                        peg$currPos += 4;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c274);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c119) {
                            s0 = peg$c119;
                            peg$currPos += 3;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c275);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 109) {
                                s0 = peg$c276;
                                peg$currPos++;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c277);
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsehour_abbrev() {
            var s0;
            if (input.substr(peg$currPos, 5) === peg$c278) {
                s0 = peg$c278;
                peg$currPos += 5;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c279);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c280) {
                    s0 = peg$c280;
                    peg$currPos += 3;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c281);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c282) {
                        s0 = peg$c282;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c283);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 104) {
                            s0 = peg$c284;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c285);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c286) {
                                s0 = peg$c286;
                                peg$currPos += 4;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c287);
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseday_abbrev() {
            var s0;
            if (input.substr(peg$currPos, 4) === peg$c288) {
                s0 = peg$c288;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c289);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c290) {
                    s0 = peg$c290;
                    peg$currPos += 3;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c291);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 100) {
                        s0 = peg$c292;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c293);
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseweek_abbrev() {
            var s0;
            if (input.substr(peg$currPos, 5) === peg$c294) {
                s0 = peg$c294;
                peg$currPos += 5;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c295);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c296) {
                    s0 = peg$c296;
                    peg$currPos += 4;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c297);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 3) === peg$c298) {
                        s0 = peg$c298;
                        peg$currPos += 3;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c299);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c300) {
                            s0 = peg$c300;
                            peg$currPos += 2;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c301);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 119) {
                                s0 = peg$c302;
                                peg$currPos++;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c303);
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseseconds() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c261) {
                s1 = peg$c261;
                peg$currPos += 6;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c262);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c304();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseunsignedInteger();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsesec_abbrev();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c305(s1);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseminutes() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c271) {
                s1 = peg$c271;
                peg$currPos += 6;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c272);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c306();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseunsignedInteger();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsemin_abbrev();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c307(s1);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsehours() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c286) {
                s1 = peg$c286;
                peg$currPos += 4;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c287);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c308();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseunsignedInteger();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsehour_abbrev();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c309(s1);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsedays() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c290) {
                s1 = peg$c290;
                peg$currPos += 3;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c291);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c310();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseunsignedInteger();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseday_abbrev();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c311(s1);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseweeks() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseunsignedInteger();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseweek_abbrev();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c312(s1);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseaddr() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseunsignedInteger();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                    s3 = peg$c81;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c82);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseunsignedInteger();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 46) {
                            s5 = peg$c81;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c82);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseunsignedInteger();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 46) {
                                    s7 = peg$c81;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c82);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parseunsignedInteger();
                                    if (s8 !== peg$FAILED) {
                                        s2 = [s2, s3, s4, s5, s6, s7, s8];
                                        s1 = s2;
                                    }
                                    else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c313();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseport() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s1 = peg$c192;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsesuint();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c36(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseip6addr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseh_prepend();
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parseh_prepend();
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseip6tail();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c314(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseh16();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseh_append();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseh_append();
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c315) {
                            s3 = peg$c315;
                            peg$currPos += 2;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c316);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = [];
                            s5 = peg$parseh_prepend();
                            while (s5 !== peg$FAILED) {
                                s4.push(s5);
                                s5 = peg$parseh_prepend();
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseip6tail();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c317(s1, s2, s4, s5);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c315) {
                        s1 = peg$c315;
                        peg$currPos += 2;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c316);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parseh_prepend();
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parseh_prepend();
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseip6tail();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c318(s2, s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseh16();
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            s3 = peg$parseh_append();
                            while (s3 !== peg$FAILED) {
                                s2.push(s3);
                                s3 = peg$parseh_append();
                            }
                            if (s2 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c315) {
                                    s3 = peg$c315;
                                    peg$currPos += 2;
                                }
                                else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c316);
                                    }
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c319(s1, s2);
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.substr(peg$currPos, 2) === peg$c315) {
                                s1 = peg$c315;
                                peg$currPos += 2;
                            }
                            else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c316);
                                }
                            }
                            if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c320();
                            }
                            s0 = s1;
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseip6tail() {
            var s0;
            s0 = peg$parseaddr();
            if (s0 === peg$FAILED) {
                s0 = peg$parseh16();
            }
            return s0;
        }
        function peg$parseh_append() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s1 = peg$c192;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseh16();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c321(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseh_prepend() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parseh16();
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                    s2 = peg$c192;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c193);
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c322(s1);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesubnet() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseaddr();
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                    s2 = peg$c213;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c214);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseunsignedInteger();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c323(s1, s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseip6subnet() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseip6addr();
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                    s2 = peg$c213;
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c214);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseunsignedInteger();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c324(s1, s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseunsignedInteger() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsesuint();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c325(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsesuint() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = [];
            if (peg$c79.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c80);
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (peg$c79.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c80);
                        }
                    }
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsesinteger() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (peg$c326.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c327);
                }
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsesuint();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesdouble() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c16;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c17);
                }
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsedoubleInteger();
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parsedoubleInteger();
                    }
                }
                else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s3 = peg$c81;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c82);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$parsedoubleDigit();
                        if (s5 !== peg$FAILED) {
                            while (s5 !== peg$FAILED) {
                                s4.push(s5);
                                s5 = peg$parsedoubleDigit();
                            }
                        }
                        else {
                            s4 = peg$FAILED;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexponentPart();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c329();
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 45) {
                    s1 = peg$c16;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c17);
                    }
                }
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s2 = peg$c81;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c82);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$parsedoubleDigit();
                        if (s4 !== peg$FAILED) {
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                s4 = peg$parsedoubleDigit();
                            }
                        }
                        else {
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseexponentPart();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c329();
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsedoubleInteger() {
            var s0, s1, s2, s3;
            if (input.charCodeAt(peg$currPos) === 48) {
                s0 = peg$c330;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c331);
                }
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (peg$c332.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c333);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c79.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c80);
                        }
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c79.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c80);
                            }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsedoubleDigit() {
            var s0;
            if (peg$c79.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c80);
                }
            }
            return s0;
        }
        function peg$parseexponentPart() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 1).toLowerCase() === peg$c334) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c335);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsesinteger();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseh16() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsehexdigit();
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parsehexdigit();
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c336();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsehexdigit() {
            var s0;
            if (peg$c337.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c338);
                }
            }
            return s0;
        }
        function peg$parsesearchWord() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsesearchWordPart();
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parsesearchWordPart();
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c339(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsesearchWordPart() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
                s1 = peg$c340;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c341);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseescapeSequence();
                if (s2 === peg$FAILED) {
                    s2 = peg$parsesearchEscape();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c18(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (peg$c342.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c343);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = peg$parsews();
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = void 0;
                }
                else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c344);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c70();
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsequotedString() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 34) {
                s1 = peg$c345;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c346);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsedoubleQuotedChar();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsedoubleQuotedChar();
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 34) {
                        s3 = peg$c345;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c346);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c347(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 39) {
                    s1 = peg$c348;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c349);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parsesingleQuotedChar();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parsesingleQuotedChar();
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 39) {
                            s3 = peg$c348;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c349);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c347(s2);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsedoubleQuotedChar() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 34) {
                s2 = peg$c345;
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c346);
                }
            }
            if (s2 === peg$FAILED) {
                s2 = peg$parseescapedChar();
            }
            peg$silentFails--;
            if (s2 === peg$FAILED) {
                s1 = void 0;
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c344);
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 92) {
                    s1 = peg$c340;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c341);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseescapeSequence();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c18(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsesingleQuotedChar() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 39) {
                s2 = peg$c348;
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c349);
                }
            }
            if (s2 === peg$FAILED) {
                s2 = peg$parseescapedChar();
            }
            peg$silentFails--;
            if (s2 === peg$FAILED) {
                s1 = void 0;
            }
            else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                if (input.length > peg$currPos) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c344);
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c70();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 92) {
                    s1 = peg$c340;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c341);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseescapeSequence();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c18(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseescapeSequence() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 120) {
                s1 = peg$c350;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c351);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsehexdigit();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsehexdigit();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c352();
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsesingleCharEscape();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseunicodeEscape();
                }
            }
            return s0;
        }
        function peg$parsesingleCharEscape() {
            var s0, s1;
            if (input.charCodeAt(peg$currPos) === 39) {
                s0 = peg$c348;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c349);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                    s0 = peg$c345;
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c346);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 92) {
                        s0 = peg$c340;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c341);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 98) {
                            s1 = peg$c353;
                            peg$currPos++;
                        }
                        else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c354);
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c355();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 102) {
                                s1 = peg$c356;
                                peg$currPos++;
                            }
                            else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c357);
                                }
                            }
                            if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c358();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 110) {
                                    s1 = peg$c359;
                                    peg$currPos++;
                                }
                                else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c360);
                                    }
                                }
                                if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c361();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.charCodeAt(peg$currPos) === 114) {
                                        s1 = peg$c362;
                                        peg$currPos++;
                                    }
                                    else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c363);
                                        }
                                    }
                                    if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c364();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.charCodeAt(peg$currPos) === 116) {
                                            s1 = peg$c365;
                                            peg$currPos++;
                                        }
                                        else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c366);
                                            }
                                        }
                                        if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c367();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.charCodeAt(peg$currPos) === 118) {
                                                s1 = peg$c368;
                                                peg$currPos++;
                                            }
                                            else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c369);
                                                }
                                            }
                                            if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c370();
                                            }
                                            s0 = s1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesearchEscape() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 61) {
                s1 = peg$c138;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c139);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c371();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 42) {
                    s1 = peg$c24;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c25);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c372();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseunicodeEscape() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 117) {
                s1 = peg$c373;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c374);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parsehexdigit();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parsehexdigit();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsehexdigit();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parsehexdigit();
                            if (s6 !== peg$FAILED) {
                                s3 = [s3, s4, s5, s6];
                                s2 = s3;
                            }
                            else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c375(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 117) {
                    s1 = peg$c373;
                    peg$currPos++;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c374);
                    }
                }
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 123) {
                        s2 = peg$c376;
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c377);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parsehexdigit();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsehexdigit();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parsehexdigit();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsehexdigit();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parsehexdigit();
                                        if (s8 === peg$FAILED) {
                                            s8 = null;
                                        }
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsehexdigit();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s4 = [s4, s5, s6, s7, s8, s9];
                                                s3 = s4;
                                            }
                                            else {
                                                peg$currPos = s3;
                                                s3 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 125) {
                                s4 = peg$c378;
                                peg$currPos++;
                            }
                            else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c379);
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c375(s3);
                                s0 = s1;
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsereString() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 47) {
                s1 = peg$c213;
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c214);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsereBody();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 47) {
                        s3 = peg$c213;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c214);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c36(s2);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereBody() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = [];
            if (peg$c380.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c381);
                }
            }
            if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c382) {
                    s2 = peg$c382;
                    peg$currPos += 2;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c383);
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (peg$c380.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c381);
                        }
                    }
                    if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c382) {
                            s2 = peg$c382;
                            peg$currPos += 2;
                        }
                        else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c383);
                            }
                        }
                    }
                }
            }
            else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseescapedChar() {
            var s0;
            if (peg$c384.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c385);
                }
            }
            return s0;
        }
        function peg$parsews() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 9) {
                s0 = peg$c386;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c387);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 11) {
                    s0 = peg$c388;
                    peg$currPos++;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c389);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 12) {
                        s0 = peg$c390;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c391);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 32) {
                            s0 = peg$c392;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c393);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 160) {
                                s0 = peg$c394;
                                peg$currPos++;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c395);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 65279) {
                                    s0 = peg$c396;
                                    peg$currPos++;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c397);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parse_() {
            var s0, s1;
            peg$silentFails++;
            s0 = [];
            s1 = peg$parsews();
            if (s1 !== peg$FAILED) {
                while (s1 !== peg$FAILED) {
                    s0.push(s1);
                    s1 = peg$parsews();
                }
            }
            else {
                s0 = peg$FAILED;
            }
            peg$silentFails--;
            if (s0 === peg$FAILED) {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c398);
                }
            }
            return s0;
        }
        function peg$parse__() {
            var s0, s1;
            s0 = [];
            s1 = peg$parsews();
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parsews();
            }
            return s0;
        }
        function peg$parseEOF() {
            var s0, s1;
            s0 = peg$currPos;
            peg$silentFails++;
            if (input.length > peg$currPos) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c344);
                }
            }
            peg$silentFails--;
            if (s1 === peg$FAILED) {
                s0 = void 0;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        let reglob$1 = reglob;
        function makeSequentialProc(procs) {
            return { op: "SequentialProc", procs };
        }
        function makeParallelProc(procs) {
            return { op: "ParallelProc", procs };
        }
        function makeLiteral(type, value) { return { op: "Literal", type, value }; }
        function makeFieldCall(fn, field, param) {
            return { op: "FieldCall", fn, field, param };
        }
        function chainFieldCalls(base, derefs) {
            let ret = { op: "FieldRead", field: base };
            for (let d of derefs) {
                d.field = ret;
                ret = d;
            }
            return ret;
        }
        function makeMatchAll() {
            return { op: "MatchAll" };
        }
        function makeSearch(text, value, bareWord) {
            if (bareWord && value.type == "string") {
                if (text == "*") {
                    return makeMatchAll();
                }
                else if (reglob$1.IsGlobby(value.value)) {
                    value = makeLiteral("regexp", reglob$1.Reglob(value.value));
                }
            }
            return { op: "Search", text, value };
        }
        function makeCompareField(comparator, field, value) {
            return { op: "CompareField", comparator, field, value };
        }
        function makeCompareAny(comparator, recursive, value) {
            return { op: "CompareAny", comparator, recursive, value };
        }
        function makeLogicalNot(expr) { return { op: "LogicalNot", expr }; }
        function makeChain(first, rest, op) {
            if (!rest || rest.length == 0) {
                return first;
            }
            let result = first;
            for (let term of rest) {
                result = { op, left: result, right: term };
            }
            return result;
        }
        function makeOrChain(first, rest) {
            return makeChain(first, rest, "LogicalOr");
        }
        function makeAndChain(first, rest) {
            return makeChain(first, rest, "LogicalAnd");
        }
        function makeArg(name, value) {
            return { name, value };
        }
        function makeSortProc(args, fields) {
            let argsMap = new Map();
            for (let arg of args) {
                if (argsMap.has(arg.name)) {
                    throw new Error(`Duplicate argument -${arg.name}`);
                }
                argsMap.set(arg.name, arg.value);
            }
            let sortdir = argsMap.has("r") ? -1 : 1;
            let nullsfirst = (argsMap.get("nulls") === "first");
            return { op: "SortProc", fields, sortdir, nullsfirst };
        }
        function makeTopProc(fields, limit, flush) {
            if (limit === null) {
                limit = undefined;
            }
            if (fields === null) {
                fields = undefined;
            }
            flush = !!flush;
            return { op: "TopProc", fields, limit, flush };
        }
        function makeCutProc(args, fields) {
            let complement = false;
            if (args.length > 1) {
                throw new Error(`Duplicate argument -c`);
            }
            if (args.length == 1) {
                complement = true;
            }
            return { op: "CutProc", complement, fields };
        }
        function makeHeadProc(count) { return { op: "HeadProc", count }; }
        function makeTailProc(count) { return { op: "TailProc", count }; }
        function makeUniqProc(cflag) { return { op: "UniqProc", cflag }; }
        function makeFilterProc(filter) { return { op: "FilterProc", filter }; }
        function makeAssignment(target, expression) { return { target, expression }; }
        function makePutProc(first, rest) {
            return { op: "PutProc", clauses: [first, ...rest] };
        }
        function makeReducer(op, var_, field) {
            if (field === null) {
                field = undefined;
            }
            return { op, var: var_, field };
        }
        function overrideReducerVar(reducer, v) {
            reducer.var = v;
            return reducer;
        }
        function makeDuration(seconds) {
            return { type: "Duration", seconds };
        }
        function makeReduceProc(reducers) {
            return { op: "ReduceProc", reducers };
        }
        function makeGroupByKey(target, expression) {
            return { op: "Assignment", target, expression };
        }
        function makeGroupByKeys(first, rest) {
            return [first, ...rest];
        }
        function makeGroupByProc(duration, limit, keys, reducers) {
            if (limit === null) {
                limit = undefined;
            }
            return { op: "GroupByProc", keys, reducers, duration, limit };
        }
        function makeUnaryExpr(operator, operand) {
            return { op: "UnaryExpr", operator, operand };
        }
        function makeCastExpression(expr, type) {
            return { op: "CastExpr", expr, type };
        }
        function makeBinaryExprChain(first, rest) {
            let ret = first;
            for (let part of rest) {
                ret = { op: "BinaryExpr", operator: part[1], lhs: ret, rhs: part[3] };
            }
            return ret;
        }
        function makeConditionalExpr(condition, thenClause, elseClause) {
            return { op: "ConditionalExpr", condition, then: thenClause, else: elseClause };
        }
        function makeFunctionCall(fn, args) {
            return { op: "FunctionCall", function: fn, args };
        }
        function joinChars(chars) {
            return chars.join("");
        }
        function toLowerCase(str) {
            return str.toLowerCase();
        }
        function OR(a, b) {
            return a || b;
        }
        function makeUnicodeChar(chars) {
            let n = parseInt(chars.join(""), 16);
            if (n < 0x10000) {
                return String.fromCharCode(n);
            }
            n -= 0x10000;
            let surrogate1 = 0xD800 + ((n >> 10) & 0x7ff);
            let surrogate2 = 0xDC00 + (n & 0x3ff);
            return String.fromCharCode(surrogate1) + String.fromCharCode(surrogate2);
        }
        peg$result = peg$startRuleFunction();
        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
        }
        else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                peg$fail(peg$endExpectation());
            }
            throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
                ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
        }
    }
    return {
        setters: [],
        execute: function () {
            reglob = {
                Reglob,
                IsGlobby,
            };
            peg$subclass(peg$SyntaxError, Error);
            peg$SyntaxError.buildMessage = function (expected, found) {
                var DESCRIBE_EXPECTATION_FNS = {
                    literal: function (expectation) {
                        return "\"" + literalEscape(expectation.text) + "\"";
                    },
                    "class": function (expectation) {
                        var escapedParts = "", i;
                        for (i = 0; i < expectation.parts.length; i++) {
                            escapedParts += expectation.parts[i] instanceof Array
                                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                                : classEscape(expectation.parts[i]);
                        }
                        return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                    },
                    any: function (expectation) {
                        return "any character";
                    },
                    end: function (expectation) {
                        return "end of input";
                    },
                    other: function (expectation) {
                        return expectation.description;
                    }
                };
                function hex(ch) {
                    return ch.charCodeAt(0).toString(16).toUpperCase();
                }
                function literalEscape(s) {
                    return s
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/\0/g, '\\0')
                        .replace(/\t/g, '\\t')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                        .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
                }
                function classEscape(s) {
                    return s
                        .replace(/\\/g, '\\\\')
                        .replace(/\]/g, '\\]')
                        .replace(/\^/g, '\\^')
                        .replace(/-/g, '\\-')
                        .replace(/\0/g, '\\0')
                        .replace(/\t/g, '\\t')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                        .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
                }
                function describeExpectation(expectation) {
                    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
                }
                function describeExpected(expected) {
                    var descriptions = new Array(expected.length), i, j;
                    for (i = 0; i < expected.length; i++) {
                        descriptions[i] = describeExpectation(expected[i]);
                    }
                    descriptions.sort();
                    if (descriptions.length > 0) {
                        for (i = 1, j = 1; i < descriptions.length; i++) {
                            if (descriptions[i - 1] !== descriptions[i]) {
                                descriptions[j] = descriptions[i];
                                j++;
                            }
                        }
                        descriptions.length = j;
                    }
                    switch (descriptions.length) {
                        case 1:
                            return descriptions[0];
                        case 2:
                            return descriptions[0] + " or " + descriptions[1];
                        default:
                            return descriptions.slice(0, -1).join(", ")
                                + ", or "
                                + descriptions[descriptions.length - 1];
                    }
                }
                function describeFound(found) {
                    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
                }
                return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
            };
            zql = {
                SyntaxError: peg$SyntaxError,
                parse: peg$parse
            };
            exports_13("default", zql);
        }
    };
});
System.register("zealot/util/time", ["zealot/util/utils"], function (exports_14, context_14) {
    "use strict";
    var utils_ts_3;
    var __moduleName = context_14 && context_14.id;
    function fracSecToNs(string) {
        const [sec, frac] = string.split(".");
        const secNs = BigInt(parseInt(sec)) * BigInt(1e9);
        const fracNs = BigInt(parseInt(frac) * Math.pow(10, 9 - frac.length));
        return secNs + fracNs;
    }
    function convertToNs(val) {
        if (utils_ts_3.isDate(val))
            return BigInt(val.getTime()) * BigInt(1e6);
        if (utils_ts_3.isBigInt(val))
            return val;
        if (utils_ts_3.isTs(val))
            return BigInt(1e9) * BigInt(val.sec) + BigInt(val.ns);
        if (utils_ts_3.isFracSec(val))
            return fracSecToNs(val);
        throw new Error(`Unknown time format: ${val}`);
    }
    function createTime(val = new Date()) {
        const ns = convertToNs(val);
        return {
            toNs() {
                return ns;
            },
            toTs() {
                const sec = ns / BigInt(1e9);
                const restNs = ns - sec * BigInt(1e9);
                return {
                    sec: Number(sec),
                    ns: Number(restNs),
                };
            },
        };
    }
    exports_14("createTime", createTime);
    return {
        setters: [
            function (utils_ts_3_1) {
                utils_ts_3 = utils_ts_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/util/span", ["zealot/util/time"], function (exports_15, context_15) {
    "use strict";
    var time_ts_1;
    var __moduleName = context_15 && context_15.id;
    function createSpan(from, to) {
        const f = time_ts_1.createTime(from);
        const t = time_ts_1.createTime(to);
        return {
            ts: f.toTs(),
            dur: time_ts_1.createTime(t.toNs() - f.toNs()).toTs(),
        };
    }
    exports_15("createSpan", createSpan);
    return {
        setters: [
            function (time_ts_1_1) {
                time_ts_1 = time_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/api/search", ["node_modules/zq/zql/zql.es", "zealot/util/span"], function (exports_16, context_16) {
    "use strict";
    var zql_es_js_1, span_ts_1;
    var __moduleName = context_16 && context_16.id;
    function searchApi(zql, args) {
        return {
            method: "POST",
            path: `/search?${getQueryParams(args)}`,
            body: JSON.stringify(getSearchBody(zql, args)),
            enhancers: args.enhancers || [],
            signal: args.signal,
        };
    }
    exports_16("default", searchApi);
    function getQueryParams(args) {
        let p = new URLSearchParams();
        p.set("format", args.format);
        if (args.controlMessages === false) {
            p.set("noctrl", "true");
        }
        return p.toString();
    }
    function getSearchBody(zql, { spaceId, from, to }) {
        const proc = zql_es_js_1.default.parse(zql);
        const span = span_ts_1.createSpan(from, to);
        return {
            proc,
            span,
            space: spaceId,
            dir: -1,
        };
    }
    exports_16("getSearchBody", getSearchBody);
    return {
        setters: [
            function (zql_es_js_1_1) {
                zql_es_js_1 = zql_es_js_1_1;
            },
            function (span_ts_1_1) {
                span_ts_1 = span_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/api/spaces", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            exports_17("default", {
                list() {
                    return {
                        path: "/space",
                        method: "GET",
                    };
                },
                get(spaceId) {
                    return {
                        path: `/space/${encodeURIComponent(spaceId)}`,
                        method: "GET",
                    };
                },
                create(args) {
                    return {
                        path: "/space",
                        method: "POST",
                        body: JSON.stringify(args),
                    };
                },
                delete(spaceId) {
                    return {
                        path: `/space/${encodeURIComponent(spaceId)}`,
                        method: "DELETE",
                    };
                },
                update(spaceId, args) {
                    return {
                        path: `/space/${encodeURIComponent(spaceId)}`,
                        method: "PUT",
                        body: JSON.stringify(args),
                    };
                },
            });
        }
    };
});
System.register("zealot/api/mod", ["zealot/api/logs", "zealot/api/pcaps", "zealot/api/search", "zealot/api/spaces"], function (exports_18, context_18) {
    "use strict";
    var logs_ts_1, pcaps_ts_1, search_ts_1, spaces_ts_1;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (logs_ts_1_1) {
                logs_ts_1 = logs_ts_1_1;
            },
            function (pcaps_ts_1_1) {
                pcaps_ts_1 = pcaps_ts_1_1;
            },
            function (search_ts_1_1) {
                search_ts_1 = search_ts_1_1;
            },
            function (spaces_ts_1_1) {
                spaces_ts_1 = spaces_ts_1_1;
            }
        ],
        execute: function () {
            exports_18("logs", logs_ts_1.default);
            exports_18("pcaps", pcaps_ts_1.default);
            exports_18("search", search_ts_1.default);
            exports_18("spaces", spaces_ts_1.default);
        }
    };
});
System.register("zealot/util/host", [], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    function getHost(hostUrl, defaultPort = "9867") {
        let [host, port] = hostUrl.split(":");
        port = port ? port : defaultPort;
        return host + ":" + port;
    }
    exports_19("getHost", getHost);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/enhancers/flatRecords", ["zealot/util/utils"], function (exports_20, context_20) {
    "use strict";
    var utils_ts_4;
    var __moduleName = context_20 && context_20.id;
    function zip(values, columns) {
        if (typeof values === "string")
            return [];
        else {
            return values.map((value, index) => {
                let { name, type } = columns[index];
                return utils_ts_4.isString(type)
                    ? { name, type, value }
                    : { name, type: "record", value: zip(value, type) };
            });
        }
    }
    function flattenFields({ name, value, type }, prefix = "") {
        return type === "record"
            ?
                flattenRecord(value, `${name}.`)
            : [{ name: prefix + name, type, value }];
    }
    function flattenRecord(record, prefix = "") {
        return record.reduce((array, field) => array.concat(flattenFields(field, prefix)), []);
    }
    function flattenType(descriptor, prefix = "") {
        return descriptor.reduce((flat, { name, type }) => {
            const cols = Array.isArray(type)
                ? flattenType(type, `${prefix}${name}.`)
                : [{ name: prefix + name, type }];
            return flat.concat(cols);
        }, []);
    }
    function flatRecords() {
        const flat_types = {};
        const types = {};
        return (payload) => {
            if (payload.type === "SearchRecords") {
                const flat_records = payload.records.map((r) => {
                    if (r.type) {
                        types[r.id] = r.type;
                        flat_types[r.id] = flattenType(r.type);
                    }
                    return flattenRecord(zip(r.values, types[r.id]), "");
                });
                return {
                    ...payload,
                    flat_records,
                    flat_types,
                };
            }
            return payload;
        };
    }
    exports_20("flatRecords", flatRecords);
    return {
        setters: [
            function (utils_ts_4_1) {
                utils_ts_4 = utils_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/enhancers/totalRecords", [], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    function totalRecords() {
        let total_records = 0;
        return (payload) => {
            if (payload.type === "TaskEnd") {
                return {
                    ...payload,
                    total_records,
                };
            }
            else if (payload.type === "SearchRecords") {
                total_records += payload.records.length;
            }
            return payload;
        };
    }
    exports_21("totalRecords", totalRecords);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("zealot/enhancers/zngToZeek", ["zealot/util/utils"], function (exports_22, context_22) {
    "use strict";
    var utils_ts_5, COMPOUND_FIELD_RGX;
    var __moduleName = context_22 && context_22.id;
    function getSingleZeekType(type) {
        switch (type) {
            case "byte":
            case "int16":
            case "int32":
            case "int64":
            case "uint16":
            case "uint32":
                return "int";
            case "uint64":
                return "count";
            case "float64":
                return "double";
            case "ip":
                return "addr";
            case "net":
                return "subnet";
            case "duration":
                return "interval";
            case "bstring":
                return "string";
            case "zenum":
                return "enum";
            default:
                return type;
        }
    }
    function getZeekType(type) {
        const match = type.match(COMPOUND_FIELD_RGX);
        if (match) {
            const [_, container, itemType] = match;
            const zeekType = getSingleZeekType(itemType);
            return `${container}[${zeekType}]`;
        }
        else {
            return getSingleZeekType(type);
        }
    }
    function recursiveReplace(zng) {
        if (utils_ts_5.isString(zng))
            return getZeekType(zng);
        else
            return replaceTypes(zng);
    }
    function replaceTypes(zng) {
        return zng.map((t) => ({
            name: t.name,
            type: recursiveReplace(t.type),
        }));
    }
    exports_22("replaceTypes", replaceTypes);
    function replaceTypesInRecord(record) {
        if (record.type)
            record.type = replaceTypes(record.type);
        return record;
    }
    function zngToZeek() {
        return (payload) => {
            if (payload.type === "SearchRecords") {
                return {
                    ...payload,
                    records: payload.records.map((r) => replaceTypesInRecord(r)),
                };
            }
            else {
                return payload;
            }
        };
    }
    exports_22("zngToZeek", zngToZeek);
    return {
        setters: [
            function (utils_ts_5_1) {
                utils_ts_5 = utils_ts_5_1;
            }
        ],
        execute: function () {
            COMPOUND_FIELD_RGX = /^(set|array)\[(\w+)\]$/;
        }
    };
});
System.register("zealot/enhancers/mod", ["zealot/enhancers/flatRecords", "zealot/enhancers/totalRecords", "zealot/enhancers/zngToZeek"], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_23(exports);
    }
    return {
        setters: [
            function (flatRecords_ts_1_1) {
                exportStar_1(flatRecords_ts_1_1);
            },
            function (totalRecords_ts_1_1) {
                exportStar_1(totalRecords_ts_1_1);
            },
            function (zngToZeek_ts_1_1) {
                exportStar_1(zngToZeek_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/config/search_args", ["zealot/enhancers/mod"], function (exports_24, context_24) {
    "use strict";
    var mod_ts_1;
    var __moduleName = context_24 && context_24.id;
    function getDefaultSearchArgs() {
        return {
            from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            to: new Date(),
            spaceId: "default",
            format: "zjson",
            controlMessages: true,
            enhancers: [mod_ts_1.zngToZeek, mod_ts_1.flatRecords, mod_ts_1.totalRecords],
        };
    }
    exports_24("getDefaultSearchArgs", getDefaultSearchArgs);
    return {
        setters: [
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/zealot", ["zealot/fetcher/fetcher", "zealot/api/mod", "zealot/util/host", "zealot/config/search_args"], function (exports_25, context_25) {
    "use strict";
    var fetcher_ts_1, mod_ts_2, host_ts_1, search_args_ts_1;
    var __moduleName = context_25 && context_25.id;
    function createZealot(hostUrl, args = { fetcher: fetcher_ts_1.createFetcher }) {
        const host = host_ts_1.getHost(hostUrl);
        const { promise, stream } = args.fetcher(host);
        let searchArgs = search_args_ts_1.getDefaultSearchArgs();
        return {
            setSearchOptions: (args) => {
                searchArgs = { ...searchArgs, ...args };
            },
            status: () => {
                return promise({ method: "GET", path: "/status" });
            },
            search: (zql, args) => {
                return stream(mod_ts_2.search(zql, { ...searchArgs, ...args }));
            },
            spaces: {
                list: () => {
                    return promise(mod_ts_2.spaces.list());
                },
                get: (id) => {
                    return promise(mod_ts_2.spaces.get(id));
                },
                create: (args) => {
                    return promise(mod_ts_2.spaces.create(args));
                },
                delete: (id) => {
                    return promise(mod_ts_2.spaces.delete(id));
                },
                update: (id, args) => {
                    return promise(mod_ts_2.spaces.update(id, args));
                },
            },
            pcaps: {
                post: (args) => {
                    return stream(mod_ts_2.pcaps.post(args));
                },
                get: (args) => {
                    return promise(mod_ts_2.pcaps.get(args));
                },
            },
            logs: {
                post: (args) => {
                    return stream(mod_ts_2.logs.post(args));
                },
            },
        };
    }
    exports_25("createZealot", createZealot);
    return {
        setters: [
            function (fetcher_ts_1_1) {
                fetcher_ts_1 = fetcher_ts_1_1;
            },
            function (mod_ts_2_1) {
                mod_ts_2 = mod_ts_2_1;
            },
            function (host_ts_1_1) {
                host_ts_1 = host_ts_1_1;
            },
            function (search_args_ts_1_1) {
                search_args_ts_1 = search_args_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/zealot_mock", ["zealot/zealot", "zealot/fetcher/stream"], function (exports_26, context_26) {
    "use strict";
    var zealot_ts_1, stream_ts_2;
    var __moduleName = context_26 && context_26.id;
    function fakeFetcher() {
        return {
            promise: ({ method, path }) => {
                throw new Error(`NoNetwork: You must stub: ${method} ${path}`);
            },
            stream: ({ method, path }) => {
                throw new Error(`NoNetwork: You must stub: ${method} ${path}`);
            },
        };
    }
    function promise(response) {
        return Promise.resolve(response);
    }
    function stream(response) {
        async function* iterator() {
            if (response) {
                for (const payload of response)
                    yield payload;
            }
        }
        const cancel = () => { };
        const resp = {};
        return Promise.resolve(stream_ts_2.createStream(iterator(), cancel, resp));
    }
    function createZealotMock() {
        const mock = zealot_ts_1.createZealot("unit.test", { fetcher: fakeFetcher });
        const calls = [];
        function stub(method, output, wrapper) {
            const [resource, action] = method.split(".");
            const fn = (input) => {
                calls.push({ method, args: input });
                return wrapper(output);
            };
            if (action) {
                mock[resource][action] = fn;
            }
            else {
                mock[resource] = fn;
            }
            return mock;
        }
        mock.stubStream = (method, output) => stub(method, output, stream);
        mock.stubPromise = (method, output) => stub(method, output, promise);
        mock.calls = (method) => calls.filter((c) => c.method === method);
        return mock;
    }
    exports_26("createZealotMock", createZealotMock);
    return {
        setters: [
            function (zealot_ts_1_1) {
                zealot_ts_1 = zealot_ts_1_1;
            },
            function (stream_ts_2_1) {
                stream_ts_2 = stream_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("zealot/mod", ["zealot/zealot", "zealot/zealot_mock"], function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_27(exports);
    }
    return {
        setters: [
            function (zealot_ts_2_1) {
                exportStar_2(zealot_ts_2_1);
            },
            function (zealot_mock_ts_1_1) {
                exportStar_2(zealot_mock_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});

const __exp = __instantiate("zealot/mod", false);
export const createZealot = __exp["createZealot"];
export const createZealotMock = __exp["createZealotMock"];
