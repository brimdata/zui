import {createFetcher, FetchArgs} from "./fetcher/fetcher"
import {Zealot, ZealotPayload} from "./types"
import {createTime} from "./util/time"
import {createZealot} from "./zealot"
import {createZealotMock, ZealotMock} from "./zealot_mock"
import * as zjson from "./zjson"
import * as zng from "./zng"

export {
  zjson,
  zng,
  createZealot,
  createZealotMock,
  createTime,
  Zealot,
  ZealotPayload,
  ZealotMock,
  createFetcher,
  FetchArgs
}
