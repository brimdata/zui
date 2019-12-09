/* @flow */
export function initTab() {
  return {
    span: [{sec: 0, ns: 0}, {sec: 1, ns: 0}],
    spanArgs: ["now - 5m", "now"],
    spanFocus: null
  }
}

export default function() {
  return {active: 0, data: [initTab()]}
}
