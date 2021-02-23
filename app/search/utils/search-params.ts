import {TimeArg, SpanArgs} from "src/js/state/Search/types"

type Args = {
  program: string
  spanArgs: SpanArgs
  pins: string[]
  spanArgsFocus: SpanArgs
}

export const encodeSearchParams = ({
  program,
  pins,
  spanArgs,
  spanArgsFocus
}: Partial<Args>) => {
  const p = new URLSearchParams()
  if (program) p.append("q", program)
  encodeSpan(p, spanArgs, "from", "to")
  encodeSpan(p, spanArgsFocus, "focusFrom", "focusTo")
  encodePins(p, pins || [])
  return p.toString()
}

type DecodedSearchParams = {
  program: string
  pins: string[]
  spanArgs: Partial<SpanArgs>
  spanArgsFocus: Partial<SpanArgs>
}

export const decodeSearchParams = (path: string): DecodedSearchParams => {
  const url = new URLSearchParams(path)
  return {
    program: url.get("q"),
    spanArgs: [url.get("from"), url.get("to")].map(decodeSpanArg) as SpanArgs,
    spanArgsFocus: [url.get("focusFrom"), url.get("focusTo")].map(
      decodeSpanArg
    ) as SpanArgs,
    pins: decodePins(url)
  }
}

const encodeSpan = (params, span, from, to) => {
  if (span && span[0]) params.append(from, encodeSpanArg(span[0]))
  if (span && span[1]) params.append(to, encodeSpanArg(span[1]))
}

const encodeSpanArg = (arg) => {
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
