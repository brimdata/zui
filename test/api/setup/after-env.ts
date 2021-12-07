import "regenerator-runtime/runtime"
import "cross-fetch/polyfill"
import {configure} from "@testing-library/react"
import env from "app/core/env"
import {Blob} from "blob-polyfill"
// @ts-ignore
global.Blob = Blob
