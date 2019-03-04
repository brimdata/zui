/* @flow */

export default {
  encode(string: string) {
    return Buffer.from(string).toString("base64")
  },

  decode(string: string) {
    return Buffer.from(string, "base64").toString("utf8")
  }
}
