interface BrimSearchParams {
  id: string
  space?: string
  host?: string
  port?: string
}

export default function getUrlSearchParams(): BrimSearchParams {
  const urlSearchParams = new URLSearchParams(window.location.search)
  // @ts-ignore
  return Object.fromEntries(urlSearchParams.entries())
}
