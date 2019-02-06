import React from "react"
import StartupError from "./StartupError"
import {shallow} from "enzyme"
import ErrorFactory from "../models/ErrorFactory"

test("#render", () => {
  shallow(<StartupError error={ErrorFactory.create("NoSpaces")} />)
})

test("#reload", () => {
  const comp = shallow(<StartupError error={ErrorFactory.create("NoSpaces")} />)
  global.location.reload = jest.fn()
  comp.instance().reload()
})

test("#clear state", () => {
  const comp = shallow(<StartupError error={ErrorFactory.create("NoSpaces")} />)
  global.location.reload = jest.fn()
  comp.instance().clearState()
})
