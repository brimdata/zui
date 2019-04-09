/* @flow */
import {deserialize, serialize} from "./serialization"

const deserialized = {
  name: "James",
  age: 28,
  date: new Date(100),
  span: [new Date(1), new Date(2)]
}

const serialized = {
  name: "James",
  age: 28,
  date: 100,
  span: [1, 2],
  __types: {
    date: "Date",
    name: "String",
    age: "Number",
    span: ["Date", "Date"]
  }
}

test("serialize an object", () => {
  expect(serialize(deserialized)).toEqual(serialized)
})

test("deserialize", () => {
  expect(deserialize(serialized)).toEqual(deserialized)
})
