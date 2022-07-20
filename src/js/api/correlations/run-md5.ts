import {zed} from "@brimdata/zealot"
import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import zql from "src/js/zql"
import {run} from "./run"

export const MD5_CORRELATION = "zui/md5-correlation"
export const TX_HOSTS_CORRELATION = "zui/tx-hosts-correlation"
export const RX_HOSTS_CORRELATION = "zui/rx-hosts-correlation"
export const FILENAME_CORRELATION = "zui/filename-correlation"

export const runMd5Correlation =
  (): Thunk =>
  (dispatch, getState, {api}) => {
    const value = api.results.selectedValue
    if (value instanceof zed.Record && value.has("md5", zed.TypeString)) {
      const tabId = api.current.tabId
      const key = Current.getLocation(getState()).key
      const pool = Current.getQuery(getState()).getPoolName()
      const md5 = value.get("md5").toJS()
      dispatch(
        run(md5Correlation(pool, md5), {id: MD5_CORRELATION, tabId, key})
      )
      dispatch(
        run(txHostsCorrelation(pool, md5), {
          id: TX_HOSTS_CORRELATION,
          tabId,
          key,
        })
      )
      dispatch(
        run(rxHostsCorrelation(pool, md5), {
          id: RX_HOSTS_CORRELATION,
          tabId,
          key,
        })
      )
      dispatch(
        run(filenameCorrelation(pool, md5), {
          id: FILENAME_CORRELATION,
          tabId,
          key,
        })
      )
    }
  }

function md5Correlation(pool: string, md5: string) {
  return zql`from ${pool} | md5==${md5} | count() by md5 | sort -r | head 5`
}

function txHostsCorrelation(pool: string, md5: string) {
  return zql`from ${pool} | md5==${md5} | count() by tx_hosts | sort -r | head 5`
}

function rxHostsCorrelation(pool: string, md5: string) {
  return zql`from ${pool} | md5==${md5} | count() by rx_hosts | sort -r | head 5`
}

function filenameCorrelation(pool: string, md5: string) {
  return zql`from ${pool} | md5==${md5} | count() by filename, mime_type | sort -r | head 5`
}
