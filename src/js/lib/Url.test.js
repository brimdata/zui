import * as Url from "./Url"

test("www.google.com", () => {
  expect(Url.isValid("www.google.com")).toBe(true)
})

test("word", () => {
  expect(Url.isValid("word")).toBe(false)
})

test("a sentence", () => {
  expect(Url.isValid("many different words")).toBe(false)
})

test("with a protocol", () => {
  expect(Url.isValid("http://www.google.com")).toBe(true)
})

test("protocol and subdomain", () => {
  expect(Url.isValid("http://www.this.that.google.com")).toBe(true)
})

test("just subdomains", () => {
  expect(Url.isValid("www.this.that.google.com")).toBe(true)
})
