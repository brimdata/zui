export const dataSets = {
  // The purpose of this object is to have a single source of truth about
  // bounds and metrics related to test data. These numbers are also dependent
  // on product behavior. For example, if the default time window changes from
  // last 30 minutes to last hour, some of these numbers may become invalid.
  sample: {
    histogram: {
      rectAttrMin: 0,
      rectAttrMax: 1000,
      wholeSpaceDistinctPaths: 8,
      wholeSpaceRectsPerClass: 11
    },
    spaceName: "sample.pcap.brim"
  }
}
