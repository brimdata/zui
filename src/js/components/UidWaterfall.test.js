import React from "react"
import {shallow} from "enzyme"
import UidWaterfall from "./UidWaterfall"

test("clicking a path tag", () => {
  shallow(<UidWaterfall broLogs={[]} />)
})
