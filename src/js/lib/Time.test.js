/* @flow */

import * as Time from "./Time"
import random from "lodash/random"

const sampleTimeZones = [
  "America/Atka",
  "America/Bahia",
  "America/Bahia_Banderas",
  "America/Barbados",
  "America/Belem",
  "America/Belize",
  "America/Blanc-Sablon",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Boise",
  "America/Buenos_Aires",
  "America/Cambridge_Bay",
  "America/Campo_Grande",
  "America/Cancun",
  "America/Caracas",
  "America/Catamarca",
  "America/Cayenne",
  "America/Cayman",
  "America/Chicago",
  "America/Chihuahua",
  "America/Coral_Harbour",
  "America/Cordoba",
  "America/Costa_Rica"
]

// We always run the tests in US/Pacific
const mockDate = new Date(2009, 8, 17, 23, 45, 0, 0)
// We always store dates as UTC strings without any zone information
const mockString = "2009-09-18 06:45:00.000"

beforeEach(() => {
  // Set a random user supplied timezone each test run to keep us
  // honest. This can be overridden per test.
  Time.setZone(sampleTimeZones[random(0, sampleTimeZones.length)])
})

test("parse a string to a date", () => {
  const date = Time.fromStore(mockString)

  expect(date).toEqual(mockDate)
})

test("store a string", () => {
  const string = Time.toStore(mockDate)

  expect(string).toBe(mockString)
})

test("set the time", () => {
  Time.setZone("US/Pacific")
  const date = Time.fromStore(mockString)
  const newDate = Time.set(date, {
    hours: 0,
    minutes: 0
  })

  expect(newDate).not.toEqual(date)
  expect(newDate).toEqual(new Date(2009, 8, 17, 0, 0))
})

test("add some time", () => {
  const date = Time.add(mockDate, 1, "hours")

  expect(date).toEqual(new Date(2009, 8, 18, 0, 45))
})

test("subtract some time", () => {
  const date = Time.subtract(mockDate, 1, "hours")

  expect(date).toEqual(new Date(2009, 8, 17, 22, 45))
})

test("format a date in a timezone", () => {
  Time.setZone("US/Pacific")
  const date = Time.fromStore(mockString)
  const string = Time.format(date, "MMM D, YYYY hh:mma")

  expect(string).toBe("Sep 17, 2009 11:45pm")
})

test("format a date in a new timeZone", () => {
  Time.setZone("US/Eastern")

  const date = Time.fromStore(mockString)
  const string = Time.format(date, "MMM D, YYYY hh:mma")
  expect(string).toBe("Sep 18, 2009 02:45am")
})

test("format a date in a different time zone", () => {
  Time.setZone("UTC")

  const date = Time.fromStore(mockString)
  const string = Time.format(date, "MMM D, YYYY hh:mma")
  expect(string).toBe("Sep 18, 2009 06:45am")
})

test("fakeZone", () => {
  // The tests run in US/Pacific time which is 3 hours behind
  // Eastern. This function makes a date that pretends to be in the
  // set TimeZone, but is actually in whichever timezone the
  // host is running in. This is to spoof libraries that do not
  // support timezones
  Time.setZone("US/Eastern")
  const date = Time.fromStore(mockString)
  const fake = Time.fakeZone(date)

  expect(fake).toEqual(Time.add(date, 3, "hours"))
})

test("toObject in US/Pacific", () => {
  Time.setZone("US/Pacific")
  const localDate = Time.fromStore(mockString)
  const {date, hours} = Time.toObject(localDate)

  expect(date).toBe(17)
  expect(hours).toBe(23)
})

test("toObject in US/Easter", () => {
  Time.setZone("US/Eastern")
  const localDate = Time.fromStore(mockString)
  const {date, hours} = Time.toObject(localDate)

  expect(date).toBe(18)
  expect(hours).toBe(2)
})

test("parseFromBoom", () => {
  const timeObj = {
    sec: 1428917793,
    ns: 750000000
  }
  const date = Time.parseFromBoom(timeObj)

  expect(date).toEqual(new Date("2015-04-13T09:36:33.750Z"))
  expect(date.getTime()).toEqual(1428917793750)
})

test("parseFromBoom with no ns", () => {
  const timeObj = {
    sec: 1428917793,
    ns: 0
  }
  const date = Time.parseFromBoom(timeObj)
  expect(date).toEqual(new Date("2015-04-13T09:36:33.000Z"))
  expect(date.getTime()).toEqual(1428917793000)
})
