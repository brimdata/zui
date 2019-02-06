/* @flow */

import React from "react"
import {shallow} from "enzyme"
import Search, {stateToProps} from "./Search"
import {AppError} from "../models/Errors"
import initStore from "../test/initStore"

let props
beforeEach(() => {
  props = {
    dispatch: () => new Promise(res => res()),
    isConnected: true,
    logsTab: true
  }
})

test("redirects to /connect if connected is false", () => {
  props.isConnected = false
  const comp = shallow(<Search {...props} />)
  expect(comp.find("Redirect")).toHaveLength(1)
})

test("does not redirect if connected", () => {
  const comp = shallow(<Search {...props} />)
  expect(comp.find("Redirect")).toHaveLength(0)
})

test("renders null if not ready", () => {
  const comp = shallow(<Search {...props} />)
  comp.setState({ready: false})

  expect(comp.find(".search-page")).toHaveLength(0)
})

test("renders an error page", () => {
  props.dispatch = () => new Promise((res, rej) => rej("NoSpaces"))
  const comp = shallow(<Search {...props} />)

  comp.setState({error: new AppError("Unknown")})

  expect(comp.find("StartupError")).toHaveLength(1)
})

test("charts when results are logs", () => {
  const comp = shallow(<Search {...props} />)
  comp.setState({ready: true})

  expect(comp.find(".search-page-header-charts")).toHaveLength(1)
})

test("no chargs when results are not logs", () => {
  props.logsTab = false
  const comp = shallow(<Search {...props} />)
  comp.setState({ready: true})

  expect(comp.find(".search-page-header-charts")).toHaveLength(0)
})

test("stateToProps", () => {
  const store = initStore()
  const props = stateToProps(store.getState())

  expect(props).toEqual({
    isConnected: false,
    logsTab: false
  })
})
