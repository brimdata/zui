import "regenerator-runtime/runtime"
import {configure} from "@testing-library/react"
import env from "app/core/env"

if (!("window" in global)) {
  global.window = {
    location: {
      search: "",
      pathname: "search.html"
    }
  }
}

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
