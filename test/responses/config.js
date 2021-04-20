// All input files are relative to the test/data directory
// All output files are relative to the test/responses directory

module.exports = {
  dns: {
    query: "_path=dns",
    input: "sample.tsv",
    output: "dns.response"
  },
  count: {
    query: "count()",
    input: "sample.tsv",
    output: "count.response"
  },
  countByPath: {
    query: "count() by _path",
    input: "sample.tsv",
    output: "count-by-path.response"
  },
  sample: {
    query: "*",
    input: "sample.tsv",
    output: "sample.response"
  },
  correlationUid: {
    query: "_path=dns",
    input: "correlation.zson",
    output: "correlation-uid.response"
  },
  correlationUidCommunityId: {
    query: "*",
    input: "correlation.zson",
    output: "correlation-uid-community-id.response"
  }
}
