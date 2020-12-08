import {ZealotPayload} from "../../../../zealot/dist/types"

export const uidAndCommunityResult: ZealotPayload[] = [
  {type: "TaskStart", task_id: 0},

  {
    type: "SearchRecords",
    channel_id: 0,
    records: [
      {
        id: 34,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "trans_depth", type: "uint64"},
            {name: "method", type: "bstring"},
            {name: "host", type: "bstring"},
            {name: "uri", type: "bstring"},
            {name: "referrer", type: "bstring"},
            {name: "version", type: "bstring"},
            {name: "user_agent", type: "bstring"},
            {name: "origin", type: "bstring"},
            {name: "request_body_len", type: "uint64"},
            {name: "response_body_len", type: "uint64"},
            {name: "status_code", type: "uint64"},
            {name: "status_msg", type: "bstring"},
            {name: "info_code", type: "uint64"},
            {name: "info_msg", type: "bstring"},
            {name: "tags", of: "string", type: "set"},
            {name: "username", type: "bstring"},
            {name: "password", type: "bstring"},
            {name: "proxied", of: "bstring", type: "set"},
            {name: "orig_fuids", of: "bstring", type: "array"},
            {name: "orig_filenames", of: "bstring", type: "array"},
            {name: "orig_mime_types", of: "bstring", type: "array"},
            {name: "resp_fuids", of: "bstring", type: "array"},
            {name: "resp_filenames", of: "bstring", type: "array"},
            {name: "resp_mime_types", of: "bstring", type: "array"}
          ],
          type: "record"
        },
        aliases: [{name: "port", type: "uint16"}],
        values: [
          "http",
          "1425568033.708128",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "4",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/Release.gpg",
          null,
          null,
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "0",
          null,
          null,
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 36,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "fuid", type: "bstring"},
            {name: "tx_hosts", of: "ip", type: "set"},
            {name: "rx_hosts", of: "ip", type: "set"},
            {name: "conn_uids", of: "bstring", type: "set"},
            {name: "source", type: "bstring"},
            {name: "depth", type: "uint64"},
            {name: "analyzers", of: "bstring", type: "set"},
            {name: "mime_type", type: "bstring"},
            {name: "filename", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "local_orig", type: "bool"},
            {name: "is_orig", type: "bool"},
            {name: "seen_bytes", type: "uint64"},
            {name: "total_bytes", type: "uint64"},
            {name: "missing_bytes", type: "uint64"},
            {name: "overflow_bytes", type: "uint64"},
            {name: "timedout", type: "bool"},
            {name: "parent_fuid", type: "bstring"},
            {name: "md5", type: "bstring"},
            {name: "sha1", type: "bstring"},
            {name: "sha256", type: "bstring"},
            {name: "extracted", type: "bstring"},
            {name: "extracted_cutoff", type: "bool"},
            {name: "extracted_size", type: "uint64"}
          ],
          type: "record"
        },
        values: [
          "files",
          "1425568033.707809",
          "FYFU9C3OwR3WX0BTVi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "355",
          "355",
          "0",
          "0",
          "F",
          null,
          "7547873386ce63909c55c8639e150aca",
          "627b32e767798633d8352fc8f22ac1f7974defbe",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 32,
        schema: {
          of: [
            {
              name: "alert",
              of: [
                {name: "action", type: "bstring"},
                {name: "category", type: "bstring"},
                {name: "gid", type: "uint64"},
                {name: "rev", type: "uint64"},
                {name: "severity", type: "uint16"},
                {name: "signature", type: "bstring"},
                {name: "signature_id", type: "uint64"},
                {
                  name: "metadata",
                  of: [
                    {name: "signature_severity", of: "bstring", type: "array"},
                    {name: "former_category", of: "bstring", type: "array"},
                    {name: "attack_target", of: "bstring", type: "array"},
                    {name: "deployment", of: "bstring", type: "array"},
                    {name: "affected_product", of: "bstring", type: "array"},
                    {name: "created_at", of: "bstring", type: "array"},
                    {name: "performance_impact", of: "bstring", type: "array"},
                    {name: "updated_at", of: "bstring", type: "array"},
                    {name: "malware_family", of: "bstring", type: "array"},
                    {name: "tag", of: "bstring", type: "array"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            },
            {name: "app_proto", type: "bstring"},
            {name: "dest_ip", type: "ip"},
            {name: "dest_port", type: "port"},
            {name: "src_ip", type: "ip"},
            {name: "src_port", type: "port"},
            {name: "event_type", type: "bstring"},
            {name: "flow_id", type: "uint64"},
            {name: "pcap_cnt", type: "uint64"},
            {name: "proto", type: "bstring"},
            {name: "ts", type: "time"},
            {name: "tx_id", type: "uint64"},
            {name: "icmp_code", type: "uint64"},
            {name: "icmp_type", type: "uint64"},
            {name: "community_id", type: "bstring"}
          ],
          type: "record"
        },
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "130.239.18.173",
          "80",
          "192.168.0.51",
          "41970",
          "alert",
          "1005825256602402",
          "1984",
          "TCP",
          "1425568033.670662",
          "1",
          null,
          null,
          "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.670662",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "3",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-backports/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "355",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FYFU9C3OwR3WX0BTVi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.670432",
          "FUbWfp1P0rsdWnsHRi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "353",
          "353",
          "0",
          "0",
          "F",
          null,
          "929fe2993c1e1654e77e938fa2dcd5c3",
          "424957dd90e54e080ff2f622767a81e14c33cacb",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.504223",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "2",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-updates/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "353",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FUbWfp1P0rsdWnsHRi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "130.239.18.173",
          "80",
          "192.168.0.51",
          "41970",
          "alert",
          "1005825256602402",
          "1943",
          "TCP",
          "1425568033.503865",
          "0",
          null,
          null,
          "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.503856",
          "F37YD91IaCrBjR55h4",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "345",
          "345",
          "0",
          "0",
          "F",
          null,
          "9643e0288c1a60048615c5f99821471b",
          "54659e477e51bd61bc10bfb8f0b4e4120ef2deb5",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.03507",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "1",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "345",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["F37YD91IaCrBjR55h4"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 38,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "proto", type: "zenum"},
            {name: "service", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "orig_bytes", type: "uint64"},
            {name: "resp_bytes", type: "uint64"},
            {name: "conn_state", type: "bstring"},
            {name: "local_orig", type: "bool"},
            {name: "local_resp", type: "bool"},
            {name: "missed_bytes", type: "uint64"},
            {name: "history", type: "bstring"},
            {name: "orig_pkts", type: "uint64"},
            {name: "orig_ip_bytes", type: "uint64"},
            {name: "resp_pkts", type: "uint64"},
            {name: "resp_ip_bytes", type: "uint64"},
            {name: "tunnel_parents", of: "bstring", type: "set"},
            {
              name: "geo",
              of: [
                {
                  name: "orig",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                },
                {
                  name: "resp",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            },
            {name: "community_id", type: "bstring"}
          ],
          type: "record"
        },
        aliases: [{name: "zenum", type: "string"}],
        values: [
          "conn",
          "1425568032.998178",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "tcp",
          "http",
          "0.70995",
          "676",
          "1530",
          "S1",
          null,
          null,
          "0",
          "ShADad",
          "7",
          "976",
          "7",
          "1822",
          null,
          [
            [null, null, null, null, null],
            ["SE", "AC", "UmeÃ¥", "63.8284", "20.2597"]
          ],
          "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
        ]
      }
    ]
  },

  {type: "SearchEnd", channel_id: 0, reason: "eof"},

  {
    type: "SearchStats",
    start_time: {sec: 1607371652, ns: 414936000},
    update_time: {sec: 1607371652, ns: 416167000},
    bytes_read: 79130,
    bytes_matched: 2024,
    records_read: 150,
    records_matched: 10
  },

  {type: "TaskEnd", task_id: 0}
]

export const uidResult: ZealotPayload[] = [
  {type: "TaskStart", task_id: 0},

  {
    type: "SearchRecords",
    channel_id: 0,
    records: [
      {
        id: 34,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "trans_depth", type: "uint64"},
            {name: "method", type: "bstring"},
            {name: "host", type: "bstring"},
            {name: "uri", type: "bstring"},
            {name: "referrer", type: "bstring"},
            {name: "version", type: "bstring"},
            {name: "user_agent", type: "bstring"},
            {name: "origin", type: "bstring"},
            {name: "request_body_len", type: "uint64"},
            {name: "response_body_len", type: "uint64"},
            {name: "status_code", type: "uint64"},
            {name: "status_msg", type: "bstring"},
            {name: "info_code", type: "uint64"},
            {name: "info_msg", type: "bstring"},
            {name: "tags", of: "string", type: "set"},
            {name: "username", type: "bstring"},
            {name: "password", type: "bstring"},
            {name: "proxied", of: "bstring", type: "set"},
            {name: "orig_fuids", of: "bstring", type: "array"},
            {name: "orig_filenames", of: "bstring", type: "array"},
            {name: "orig_mime_types", of: "bstring", type: "array"},
            {name: "resp_fuids", of: "bstring", type: "array"},
            {name: "resp_filenames", of: "bstring", type: "array"},
            {name: "resp_mime_types", of: "bstring", type: "array"}
          ],
          type: "record"
        },
        aliases: [{name: "port", type: "uint16"}],
        values: [
          "http",
          "1425568033.708128",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "4",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/Release.gpg",
          null,
          null,
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "0",
          null,
          null,
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 36,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "fuid", type: "bstring"},
            {name: "tx_hosts", of: "ip", type: "set"},
            {name: "rx_hosts", of: "ip", type: "set"},
            {name: "conn_uids", of: "bstring", type: "set"},
            {name: "source", type: "bstring"},
            {name: "depth", type: "uint64"},
            {name: "analyzers", of: "bstring", type: "set"},
            {name: "mime_type", type: "bstring"},
            {name: "filename", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "local_orig", type: "bool"},
            {name: "is_orig", type: "bool"},
            {name: "seen_bytes", type: "uint64"},
            {name: "total_bytes", type: "uint64"},
            {name: "missing_bytes", type: "uint64"},
            {name: "overflow_bytes", type: "uint64"},
            {name: "timedout", type: "bool"},
            {name: "parent_fuid", type: "bstring"},
            {name: "md5", type: "bstring"},
            {name: "sha1", type: "bstring"},
            {name: "sha256", type: "bstring"},
            {name: "extracted", type: "bstring"},
            {name: "extracted_cutoff", type: "bool"},
            {name: "extracted_size", type: "uint64"}
          ],
          type: "record"
        },
        values: [
          "files",
          "1425568033.707809",
          "FYFU9C3OwR3WX0BTVi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "355",
          "355",
          "0",
          "0",
          "F",
          null,
          "7547873386ce63909c55c8639e150aca",
          "627b32e767798633d8352fc8f22ac1f7974defbe",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.670662",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "3",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-backports/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "355",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FYFU9C3OwR3WX0BTVi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.670432",
          "FUbWfp1P0rsdWnsHRi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "353",
          "353",
          "0",
          "0",
          "F",
          null,
          "929fe2993c1e1654e77e938fa2dcd5c3",
          "424957dd90e54e080ff2f622767a81e14c33cacb",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.504223",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "2",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-updates/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "353",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FUbWfp1P0rsdWnsHRi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.503856",
          "F37YD91IaCrBjR55h4",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "345",
          "345",
          "0",
          "0",
          "F",
          null,
          "9643e0288c1a60048615c5f99821471b",
          "54659e477e51bd61bc10bfb8f0b4e4120ef2deb5",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.03507",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "1",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "345",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["F37YD91IaCrBjR55h4"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 38,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "proto", type: "zenum"},
            {name: "service", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "orig_bytes", type: "uint64"},
            {name: "resp_bytes", type: "uint64"},
            {name: "conn_state", type: "bstring"},
            {name: "local_orig", type: "bool"},
            {name: "local_resp", type: "bool"},
            {name: "missed_bytes", type: "uint64"},
            {name: "history", type: "bstring"},
            {name: "orig_pkts", type: "uint64"},
            {name: "orig_ip_bytes", type: "uint64"},
            {name: "resp_pkts", type: "uint64"},
            {name: "resp_ip_bytes", type: "uint64"},
            {name: "tunnel_parents", of: "bstring", type: "set"},
            {
              name: "geo",
              of: [
                {
                  name: "orig",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                },
                {
                  name: "resp",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            },
            {name: "community_id", type: "bstring"}
          ],
          type: "record"
        },
        aliases: [{name: "zenum", type: "string"}],
        values: [
          "conn",
          "1425568032.998178",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "tcp",
          "http",
          "0.70995",
          "676",
          "1530",
          "S1",
          null,
          null,
          "0",
          "ShADad",
          "7",
          "976",
          "7",
          "1822",
          null,
          [
            [null, null, null, null, null],
            ["SE", "AC", "UmeÃ¥", "63.8284", "20.2597"]
          ],
          "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
        ]
      }
    ]
  },

  {type: "SearchEnd", channel_id: 0, reason: "eof"},

  {
    type: "SearchStats",
    start_time: {sec: 1607370798, ns: 300356000},
    update_time: {sec: 1607370798, ns: 301295000},
    bytes_read: 79328,
    bytes_matched: 1523,
    records_read: 82,
    records_matched: 8
  },

  {type: "TaskEnd", task_id: 0}
]

export const noCommunityIdInConn: ZealotPayload[] = [
  {type: "TaskStart", task_id: 0},

  {
    type: "SearchRecords",
    channel_id: 0,
    records: [
      {
        id: 34,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "trans_depth", type: "uint64"},
            {name: "method", type: "bstring"},
            {name: "host", type: "bstring"},
            {name: "uri", type: "bstring"},
            {name: "referrer", type: "bstring"},
            {name: "version", type: "bstring"},
            {name: "user_agent", type: "bstring"},
            {name: "origin", type: "bstring"},
            {name: "request_body_len", type: "uint64"},
            {name: "response_body_len", type: "uint64"},
            {name: "status_code", type: "uint64"},
            {name: "status_msg", type: "bstring"},
            {name: "info_code", type: "uint64"},
            {name: "info_msg", type: "bstring"},
            {name: "tags", of: "string", type: "set"},
            {name: "username", type: "bstring"},
            {name: "password", type: "bstring"},
            {name: "proxied", of: "bstring", type: "set"},
            {name: "orig_fuids", of: "bstring", type: "array"},
            {name: "orig_filenames", of: "bstring", type: "array"},
            {name: "orig_mime_types", of: "bstring", type: "array"},
            {name: "resp_fuids", of: "bstring", type: "array"},
            {name: "resp_filenames", of: "bstring", type: "array"},
            {name: "resp_mime_types", of: "bstring", type: "array"}
          ],
          type: "record"
        },
        aliases: [{name: "port", type: "uint16"}],
        values: [
          "http",
          "1425568033.708128",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "4",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/Release.gpg",
          null,
          null,
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "0",
          null,
          null,
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 36,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "fuid", type: "bstring"},
            {name: "tx_hosts", of: "ip", type: "set"},
            {name: "rx_hosts", of: "ip", type: "set"},
            {name: "conn_uids", of: "bstring", type: "set"},
            {name: "source", type: "bstring"},
            {name: "depth", type: "uint64"},
            {name: "analyzers", of: "bstring", type: "set"},
            {name: "mime_type", type: "bstring"},
            {name: "filename", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "local_orig", type: "bool"},
            {name: "is_orig", type: "bool"},
            {name: "seen_bytes", type: "uint64"},
            {name: "total_bytes", type: "uint64"},
            {name: "missing_bytes", type: "uint64"},
            {name: "overflow_bytes", type: "uint64"},
            {name: "timedout", type: "bool"},
            {name: "parent_fuid", type: "bstring"},
            {name: "md5", type: "bstring"},
            {name: "sha1", type: "bstring"},
            {name: "sha256", type: "bstring"},
            {name: "extracted", type: "bstring"},
            {name: "extracted_cutoff", type: "bool"},
            {name: "extracted_size", type: "uint64"}
          ],
          type: "record"
        },
        values: [
          "files",
          "1425568033.707809",
          "FYFU9C3OwR3WX0BTVi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "355",
          "355",
          "0",
          "0",
          "F",
          null,
          "7547873386ce63909c55c8639e150aca",
          "627b32e767798633d8352fc8f22ac1f7974defbe",
          null,
          null,
          null,
          null
        ]
      },

      {
        id: 34,
        values: [
          "http",
          "1425568033.670662",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "3",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-backports/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "355",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FYFU9C3OwR3WX0BTVi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.670432",
          "FUbWfp1P0rsdWnsHRi",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "353",
          "353",
          "0",
          "0",
          "F",
          null,
          "929fe2993c1e1654e77e938fa2dcd5c3",
          "424957dd90e54e080ff2f622767a81e14c33cacb",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.504223",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "2",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic-updates/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "353",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["FUbWfp1P0rsdWnsHRi"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 36,
        values: [
          "files",
          "1425568033.503856",
          "F37YD91IaCrBjR55h4",
          ["130.239.18.173"],
          ["192.168.0.51"],
          ["CbOjYpkXn9LfqV51c"],
          "HTTP",
          "0",
          ["MD5", "SHA1"],
          "text/html",
          null,
          "0",
          null,
          "F",
          "345",
          "345",
          "0",
          "0",
          "F",
          null,
          "9643e0288c1a60048615c5f99821471b",
          "54659e477e51bd61bc10bfb8f0b4e4120ef2deb5",
          null,
          null,
          null,
          null
        ]
      },
      {
        id: 34,
        values: [
          "http",
          "1425568033.03507",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "1",
          "GET",
          "se.archive.ubuntu.com",
          "/ubuntu/dists/utopic/InRelease",
          null,
          "1.1",
          "Debian APT-HTTP/1.3 (1.0.9.2ubuntu2)",
          null,
          "0",
          "345",
          "404",
          "Not Found",
          null,
          null,
          [],
          null,
          null,
          null,
          null,
          null,
          null,
          ["F37YD91IaCrBjR55h4"],
          null,
          ["text/html"]
        ]
      },
      {
        id: 38,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "proto", type: "zenum"},
            {name: "service", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "orig_bytes", type: "uint64"},
            {name: "resp_bytes", type: "uint64"},
            {name: "conn_state", type: "bstring"},
            {name: "local_orig", type: "bool"},
            {name: "local_resp", type: "bool"},
            {name: "missed_bytes", type: "uint64"},
            {name: "history", type: "bstring"},
            {name: "orig_pkts", type: "uint64"},
            {name: "orig_ip_bytes", type: "uint64"},
            {name: "resp_pkts", type: "uint64"},
            {name: "resp_ip_bytes", type: "uint64"},
            {name: "tunnel_parents", of: "bstring", type: "set"},
            {
              name: "geo",
              of: [
                {
                  name: "orig",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                },
                {
                  name: "resp",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            }
          ],
          type: "record"
        },
        aliases: [{name: "zenum", type: "string"}],
        values: [
          "conn",
          "1425568032.998178",
          "CbOjYpkXn9LfqV51c",
          ["192.168.0.51", "41970", "130.239.18.173", "80"],
          "tcp",
          "http",
          "0.70995",
          "676",
          "1530",
          "S1",
          null,
          null,
          "0",
          "ShADad",
          "7",
          "976",
          "7",
          "1822",
          null,
          [
            [null, null, null, null, null],
            ["SE", "AC", "UmeÃ¥", "63.8284", "20.2597"]
          ]
        ]
      }
    ]
  },

  {type: "SearchEnd", channel_id: 0, reason: "eof"},

  {
    type: "SearchStats",
    start_time: {sec: 1607371652, ns: 414936000},
    update_time: {sec: 1607371652, ns: 416167000},
    bytes_read: 79130,
    bytes_matched: 2024,
    records_read: 150,
    records_matched: 10
  },

  {type: "TaskEnd", task_id: 0}
]

export const alertResults: ZealotPayload[] = [
  {type: "TaskStart", task_id: 0},

  {
    type: "SearchRecords",
    channel_id: 0,
    records: [
      {
        id: 32,
        schema: {
          of: [
            {
              name: "alert",
              of: [
                {name: "action", type: "bstring"},
                {name: "category", type: "bstring"},
                {name: "gid", type: "uint64"},
                {name: "rev", type: "uint64"},
                {name: "severity", type: "uint16"},
                {name: "signature", type: "bstring"},
                {name: "signature_id", type: "uint64"},
                {
                  name: "metadata",
                  of: [
                    {name: "signature_severity", of: "bstring", type: "array"},
                    {name: "former_category", of: "bstring", type: "array"},
                    {name: "attack_target", of: "bstring", type: "array"},
                    {name: "deployment", of: "bstring", type: "array"},
                    {name: "affected_product", of: "bstring", type: "array"},
                    {name: "created_at", of: "bstring", type: "array"},
                    {name: "performance_impact", of: "bstring", type: "array"},
                    {name: "updated_at", of: "bstring", type: "array"},
                    {name: "malware_family", of: "bstring", type: "array"},
                    {name: "tag", of: "bstring", type: "array"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            },
            {name: "app_proto", type: "bstring"},
            {name: "dest_ip", type: "ip"},
            {name: "dest_port", type: "port"},
            {name: "src_ip", type: "ip"},
            {name: "src_port", type: "port"},
            {name: "event_type", type: "bstring"},
            {name: "flow_id", type: "uint64"},
            {name: "pcap_cnt", type: "uint64"},
            {name: "proto", type: "bstring"},
            {name: "ts", type: "time"},
            {name: "tx_id", type: "uint64"},
            {name: "icmp_code", type: "uint64"},
            {name: "icmp_type", type: "uint64"},
            {name: "community_id", type: "bstring"}
          ],
          type: "record"
        },
        aliases: [{name: "port", type: "uint16"}],
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1982",
          "TCP",
          "1425568033.664772",
          "6",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1960",
          "TCP",
          "1425568033.600364",
          "5",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1953",
          "TCP",
          "1425568033.530645",
          "4",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1940",
          "TCP",
          "1425568033.452624",
          "3",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1917",
          "TCP",
          "1425568033.304069",
          "2",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1909",
          "TCP",
          "1425568033.230549",
          "1",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          "1905",
          "TCP",
          "1425568033.154566",
          "0",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      },
      {
        id: 38,
        schema: {
          of: [
            {name: "_path", type: "string"},
            {name: "ts", type: "time"},
            {name: "uid", type: "bstring"},
            {
              name: "id",
              of: [
                {name: "orig_h", type: "ip"},
                {name: "orig_p", type: "port"},
                {name: "resp_h", type: "ip"},
                {name: "resp_p", type: "port"}
              ],
              type: "record"
            },
            {name: "proto", type: "zenum"},
            {name: "service", type: "bstring"},
            {name: "duration", type: "duration"},
            {name: "orig_bytes", type: "uint64"},
            {name: "resp_bytes", type: "uint64"},
            {name: "conn_state", type: "bstring"},
            {name: "local_orig", type: "bool"},
            {name: "local_resp", type: "bool"},
            {name: "missed_bytes", type: "uint64"},
            {name: "history", type: "bstring"},
            {name: "orig_pkts", type: "uint64"},
            {name: "orig_ip_bytes", type: "uint64"},
            {name: "resp_pkts", type: "uint64"},
            {name: "resp_ip_bytes", type: "uint64"},
            {name: "tunnel_parents", of: "bstring", type: "set"},
            {
              name: "geo",
              of: [
                {
                  name: "orig",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                },
                {
                  name: "resp",
                  of: [
                    {name: "country_code", type: "bstring"},
                    {name: "region", type: "bstring"},
                    {name: "city", type: "bstring"},
                    {name: "latitude", type: "float64"},
                    {name: "longitude", type: "float64"}
                  ],
                  type: "record"
                }
              ],
              type: "record"
            },
            {name: "community_id", type: "bstring"}
          ],
          type: "record"
        },
        aliases: [{name: "zenum", type: "string"}],
        values: [
          "conn",
          "1425568033.025596",
          "C7HFb3jBpapYS0UIc",
          ["192.168.0.51", "33668", "91.189.92.152", "80"],
          "tcp",
          "http",
          "0.664408",
          "1312",
          "16273",
          "S1",
          null,
          null,
          "2776",
          "ShADadg",
          "17",
          "2204",
          "28",
          "17741",
          null,
          [
            [null, null, null, null, null],
            ["GB", "ENG", "London", "51.5164", "-0.093"]
          ],
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      }
    ]
  },

  {
    type: "SearchRecords",
    channel_id: 0,
    records: [
      {
        id: 32,
        values: [
          [
            "allowed",
            "Not Suspicious Traffic",
            "1",
            "6",
            "3",
            "ET POLICY GNU\\/Linux APT User-Agent Outbound likely related to package management",
            "2013504",
            [
              null,
              ["POLICY"],
              null,
              null,
              null,
              ["2011_08_31"],
              null,
              ["2020_04_22"],
              null,
              null
            ]
          ],
          "http",
          "91.189.92.152",
          "80",
          "192.168.0.51",
          "33668",
          "alert",
          "114471366386684",
          null,
          "TCP",
          "1425567868.580509",
          "7",
          null,
          null,
          "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
        ]
      }
    ]
  },

  {type: "SearchEnd", channel_id: 0, reason: "eof"},

  {
    type: "SearchStats",
    start_time: {sec: 1607378577, ns: 830085000},
    update_time: {sec: 1607378577, ns: 831030000},
    bytes_read: 79130,
    bytes_matched: 2163,
    records_read: 150,
    records_matched: 9
  },

  {type: "TaskEnd", task_id: 0}
]
