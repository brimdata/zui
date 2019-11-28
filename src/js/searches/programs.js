/* @flow */

export function md5Correlation(md5: string) {
  return `md5=${md5} | count() by md5 | sort -r | head 5`
}

export function txHostsCorrelation(md5: string) {
  return `md5=${md5} | count() by tx_hosts | sort -r | head 5`
}

export function rxHostsCorrelation(md5: string) {
  return `md5=${md5} | count() by rx_hosts | sort -r | head 5`
}

export function filenameCorrelation(md5: string) {
  return `md5=${md5} | count() by filename, mime_type | sort -r | head 5`
}

export const UID_CORRELATION_LIMIT = 100
export function uidCorrelation(uid: string) {
  return `uid=${uid} or ${uid} in conn_uids or ${uid} in uids | head ${UID_CORRELATION_LIMIT}`
}
