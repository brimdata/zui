/* @flow */

export default function deliver(host: string, {path, method, body}: Object) {
  let url = `http://${host}${path}`
  return fetch(url, {method, body}).then((resp) =>
    tryJson(resp).then((content) =>
      resp.ok ? content : Promise.reject(content)
    )
  )
}

function tryJson(resp) {
  return resp.text().then((t) => {
    try {
      return JSON.parse(t)
    } catch (_e) {
      return t
    }
  })
}
