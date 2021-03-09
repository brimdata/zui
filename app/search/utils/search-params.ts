import {TimeArg, SpanArgs} from "src/js/state/Search/types"

/**
 * This could be it's own folder now called search-params-encoder
 * With another file called utils that has all the helper functions
 */

export type DecodedSearchParams = {
  program: string
  pins: string[]
  spanArgs: Partial<SpanArgs>
  spanArgsFocus: Partial<SpanArgs>
  keep: boolean
}

export const encodeSearchParams = ({
  program,
  pins,
  spanArgs,
  spanArgsFocus,
  keep
}: Partial<DecodedSearchParams>) => {
  const p = new URLSearchParams()
  if (program) p.append("q", program)
  encodeSpan(p, spanArgs, "from", "to")
  encodeSpan(p, spanArgsFocus, "focusFrom", "focusTo")
  encodePins(p, pins || [])
  encodeBool(p, keep, "keep")
  return p.toString()
}

export const decodeSearchParams = (path: string): DecodedSearchParams => {
  const url = new URLSearchParams(path)
  return {
    program: url.get("q") || "",
    spanArgs: [url.get("from"), url.get("to")].map(decodeSpanArg) as SpanArgs,
    spanArgsFocus: [url.get("focusFrom"), url.get("focusTo")].map(
      decodeSpanArg
    ) as SpanArgs,
    pins: decodePins(url),
    keep: decodeBool(url, "keep")
  }
}

export function encodeBool(params, value, name) {
  if (value) {
    params.set(name, "true")
  }
}

export function decodeBool(params, name) {
  const value = params.get(name)
  return value === "true"
}

export function decodeSpanParams(
  path: string,
  from: string,
  to: string
): Partial<SpanArgs> {
  return decodeSpan(new URLSearchParams(path), from, to) as Partial<SpanArgs>
}

const encodeSpan = (params, span, from, to) => {
  if (span && span[0]) params.append(from, encodeSpanArg(span[0]))
  if (span && span[1]) params.append(to, encodeSpanArg(span[1]))
}

const decodeSpan = (params, from, to) => {
  const f = decodeSpanArg(params.get(from))
  const t = decodeSpanArg(params.get(to))
  return [f, t]
}

export const encodeSpanArg = (arg) => {
  return typeof arg === "string" ? arg : `${arg.sec}.${arg.ns}`
}

const decodeSpanArg = (arg): TimeArg | null => {
  if (!arg) return null
  if (/^\d+\.\d+$/.test(arg)) {
    const [sec, ns] = arg.split(".").map((i) => parseInt(i))
    return {sec, ns}
  } else {
    return arg
  }
}

const pinKey = (i) => `p${i}`

const encodePins = (params, pins) => {
  for (let i = 0; i < pins.length; ++i) {
    params.append(pinKey(i), pins[i])
  }
}

const decodePins = (params) => {
  const pins = []
  for (let i = 0; params.has(pinKey(i)); i++) pins.push(params.get(pinKey(i)))

  return pins
}
