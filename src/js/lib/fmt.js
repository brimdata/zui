/* @flow */

export const bytes = (bytes: number = 0) => {
  const int = parseInt(bytes)
  const string = int.toString()

  if (string.length > 12) return (int / 1e12).toFixed(1) + " TB"
  if (string.length > 9) return (int / 1e9).toFixed(1) + " GB"
  if (string.length > 6) return (int / 1e6).toFixed(1) + " MB"
  if (string.length > 3) return (int / 1e3).toFixed(1) + " KB"
  return int + " B"
}

export const withCommas = (int: number = 0) =>
  int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
