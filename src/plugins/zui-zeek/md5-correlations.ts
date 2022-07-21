import {zed} from "@brimdata/zealot"
import BrimApi from "src/js/api"
import {Correlation} from "src/js/api/correlations/types"
import zql from "src/js/zql"

function hasMd5(api: BrimApi) {
  const value = api.current.value
  return (
    value instanceof zed.Record &&
    value.has("md5", zed.TypeString) &&
    !value.get("md5").isUnset() &&
    !!api.current.poolName
  )
}

export const md5Correlation: Correlation = {
  id: "zui-zeek/md5-correlation",
  when: hasMd5,
  query: (api) => {
    const md5 = api.current.value.get("md5").toJS()
    return zql`
        from ${api.current.poolName} 
        | md5==${md5} 
        | count() by md5 
        | sort -r 
        | head 5`
  },
}

export const txHostsCorrelation: Correlation = {
  id: "zui-zeek/tx-hosts-correlation",
  when: hasMd5,
  query: (api) => {
    const md5 = api.current.value.get("md5").toJS()
    return zql`
        from ${api.current.poolName} 
        | md5==${md5} 
        | count() by tx_hosts 
        | sort -r 
        | head 5`
  },
}

export const rxHostsCorrelation: Correlation = {
  id: "zui-zeek/rx-hosts-correlation",
  when: hasMd5,
  query: (api) => {
    const md5 = api.current.value.get("md5").toJS()
    return zql`
          from ${api.current.poolName} 
          | md5==${md5} 
          | count() by rx_hosts 
          | sort -r 
          | head 5`
  },
}

export const filenameCorrelation: Correlation = {
  id: "zui-zeek/filename-correlation",
  when: hasMd5,
  query: (api) => {
    const md5 = api.current.value.get("md5").toJS()
    return zql`
          from ${api.current.poolName} 
          | md5==${md5} 
          | count() by filename, mime_type
          | sort -r 
          | head 5`
  },
}
