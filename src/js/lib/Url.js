import validUrl from "valid-url"

export const isValid = url => {
  return (
    !!validUrl.isUri(url) ||
    (url.includes(".") && !!validUrl.isUri("fake://" + url))
  )
}
