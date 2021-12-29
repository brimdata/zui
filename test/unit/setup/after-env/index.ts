import "regenerator-runtime/runtime"
import "./mock-network"
import {configure} from "@testing-library/react"
import env from "app/core/env"

global.window = {
  location: {
    search: "",
    pathname: "search.html"
  }
}

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
