/* @flow */
import React from "react"

import {shallow} from "enzyme"

import {UnauthorizedError} from "../models/Errors"
import AppError from "../models/AppError"
import Search, {stateToProps} from "./Search"
import initStore from "../test/initStore"

let props
beforeEach(() => {
  props = {
    dispatch: () => new Promise(res => res()),
    logsTab: true
  }
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

test("redirects when unauthorized error", () => {
  const comp = shallow(<Search {...props} />)
  comp.setState({error: new UnauthorizedError("")})

  expect(comp.find("Redirect")).toHaveLength(1)
})

test("stateToProps", () => {
  const store = initStore()
  const props = stateToProps(store.getState())

  expect(props).toEqual({
    logsTab: false
  })
})
