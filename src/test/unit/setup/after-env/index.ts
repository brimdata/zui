import "regenerator-runtime/runtime"
import {configure} from "@testing-library/react"
import env from "src/app/core/env"

if (!("window" in global)) {
  // @ts-ignore
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
