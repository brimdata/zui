/* @flow */
export default function getUrlSearchParams(): Object {
  var urlSearchParams = new URLSearchParams(global.location.search)
  return Object.fromEntries(urlSearchParams.entries())
}
