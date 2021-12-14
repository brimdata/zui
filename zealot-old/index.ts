import "cross-fetch/polyfill"
import {parse} from "./parser"
import {createFetcher, FetchArgs} from "./fetcher/fetcher"
import {Zealot, ZealotPayload, ZealotPayloadValue, QueryFormat} from "./types"
import {createTime} from "./util/time"
import {createZealot} from "./zealot"
import {createZealotMock, ZealotMock} from "./zealot_mock"

export {
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
  parse
}
