export function setAnalysis({id, descriptor, tuples}) {
  return {
    type: "ANALYSIS_SET",
    id,
    descriptor,
    tuples
  }
}
