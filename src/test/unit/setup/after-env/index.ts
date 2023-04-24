import "regenerator-runtime/runtime"
import {configure} from "@testing-library/react"
import env from "src/app/core/env"
import {preloadApi} from "src/js/electron/windows/preload"

global.zui = {...preloadApi(), windowName: "search"}

if (env.isCI) {
  configure({asyncUtilTimeout: 5000})
}
