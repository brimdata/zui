/* @flow */
import base64 from "./base64"

export function basicAuthHeader(user: string, pass: string) {
  return {
    Authorization: `Basic ${base64.encode(user + ":" + pass)}`
  }
}
