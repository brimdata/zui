import "regenerator-runtime/runtime"
import "@testing-library/jest-dom"
import "./mock-network"
import "./polyfill-dom"
import "./polyfill-fetch"
import {configure} from "@testing-library/react"
import env from "app/core/env"

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
