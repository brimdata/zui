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
