/* @flow */

export const histogramSearchResult = (data: Object) => ({
  type: "HISTOGRAM_SEARCH_RESULT",
  data
})

export const clearHistogram = () => ({
  type: "HISTOGRAM_CLEAR"
})
