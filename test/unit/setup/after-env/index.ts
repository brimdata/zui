import "regenerator-runtime/runtime"
import "./mock-network"
import {configure} from "@testing-library/react"
import env from "app/core/env"

global.window = {
  // @ts-ignore
  location: {
    search: "",
    pathname: "search.html",
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    port: "",
    protocol: ""
  }
}

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
