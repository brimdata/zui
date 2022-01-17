// All input files are relative to the test/data directory
// All output files are relative to the test/responses directory

module.exports = {
  dns: {
    query: '_path=="dns"',
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
  everyCountByPath: {
    query: "count() by every(1s), _path",
    input: "sample.tsv",
    output: "every-count-by-path.response"
  },
  sample: {
    query: "*",
    input: "sample.tsv",
    output: "sample.response"
  },
  correlationUid: {
    query: "*",
    input: "correlation.zson",
    output: "correlation-uid.response"
  },
  correlationUidCommunityId: {
    query: "*",
    input: "correlation.zson",
    output: "correlation-uid-community-id.response"
  },
  noCommunityIdInConn: {
    query: "*",
    input: "no-community-id-in-conn.zson",
    output: "no-community-id-in-conn.response"
  },
  searchWarning: {
    query: "* | sort boo",
    input: "sample.tsv",
    output: "search-warning.response"
  },
  onlyAlerts: {
    query: "*",
    input: "only-alerts.zng",
    output: "only-alerts.response"
  }
}
