import "cross-fetch/polyfill"
import {parse} from "./parser"
import {createFetcher, FetchArgs} from "./fetcher/fetcher"
import {Zealot, ZealotPayload, ZealotPayloadValue, QueryFormat} from "./types"
import {createTime} from "./util/time"
import {createZealot} from "./zealot"
import {createZealotMock, ZealotMock} from "./zealot_mock"
import {zed, zjson} from "@brimdata/zealot"
const ZealotContext = new zed.Context()

export {
  ZealotContext,
  zjson,
  createZealot,
  createZealotMock,
  createTime,
  Zealot,
  ZealotPayload,
  ZealotPayloadValue,
  QueryFormat,
  ZealotMock,
  createFetcher,
  FetchArgs,
  parse,
  zed
}
