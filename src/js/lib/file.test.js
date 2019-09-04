/* @flow */
import lib from "./"

test("get all files in directory as array", () => {
  return lib.file("/Users/jkerr/Desktop/zeek-logs/conn.log").allFiles()
})

test("read it", () => {
  return lib.file("/Users/jkerr/Desktop/zeek-logs/conn.log").read()
})
