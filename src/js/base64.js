import base64js from "base64-js"

export default {
  encode(str, encoding = "utf-8") {
    var bytes = new TextEncoder(encoding).encode(str)
    return base64js.fromByteArray(bytes)
  },

  decode(str, encoding = "utf-8") {
    var bytes = base64js.toByteArray(str)
    return new TextDecoder(encoding).decode(bytes)
  }
}
