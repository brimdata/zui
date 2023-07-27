import {loader} from "@monaco-editor/react"

const primitiveTypes = [
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "int8",
  "int16",
  "int32",
  "int64",
  "float16",
  "float32",
  "float64",
  "bool",
  "string",
  "duration",
  "time",
  "bytes",
  "ip",
  "net",
  "type",
  "null",
]

const keywords = ["this", "const", "from", "file", "func", "op", "type"]

const builtinOps = [
  "assert",
  "combine",
  "cut",
  "drop",
  "file",
  "fork",
  "from",
  "fuse",
  "get",
  "head",
  "join",
  "load",
  "merge",
  "over",
  "pass",
  "put",
  "rename",
  "sample",
  "search",
  "sort",
  "summarize",
  "switch",
  "tail",
  "uniq",
  "where",
  "yield",
]

const builtinFuncs = [
  "abs",
  "base64",
  "bucket",
  "cast",
  "ceil",
  "cidr_match",
  "compare",
  "coalesce",
  "crop",
  "error",
  "every",
  "fields",
  "fill",
  "flatten",
  "floor",
  "grep",
  "has",
  "hex",
  "has_error",
  "is",
  "is_error",
  "join",
  "kind",
  "ksuid",
  "len",
  "levenshtein",
  "log",
  "lower",
  "missing",
  "nameof",
  "nest_dotted",
  "network_of",
  "now",
  "order",
  "parse_uri",
  "parse_zson",
  "pow",
  "quiet",
  "regexp",
  "regexp_replace",
  "replace",
  "round",
  "rune_len",
  "shape",
  "split",
  "sqrt",
  "trim",
  "typename",
  "typeof",
  "typeunder",
  "under",
  "unflatten",
  "upper",
]

const builtinAggFuncs = [
  "AND",
  "OR",
  "and",
  "any",
  "avg",
  "collect",
  "count",
  "dcount",
  "fuse",
  "map",
  "max",
  "min",
  "or",
  "sum",
  "union",
]

const operators = ["+", "-", "*", "/", ">", ">=", "<", "<=", "=", ":="]

const symbols = /[+\-*\/><=:]+/

const identifier = /[a-zA-Z][\w$]*/

const identifierRule = [
  identifier,
  {
    cases: {
      "@keywords": "keyword",
      "@builtinOps": "keyword",
      "@builtinFuncs": "keyword",
      "@builtinAggFuncs": "keyword",
      "@primitiveTypes": "keyword",
      "@operators": "operators",
      "@default": "variable",
    },
  },
]

const operatorRule = [
  symbols,
  {
    cases: {
      "@operators": "operator",
      "#default": "",
    },
  },
]

const integerRule = [/\d+/, "number"]
const floatRule = [/\d*\.\d+/, "number.float"]
const stringRule = [/("[^"]*")|('[^']*')/, "string"]
const commentRule = [/\/\/.*/, "comment"]
const bracketRule = [/[{}()\[\]]/, "@brackets"]

export async function initializeMonaco() {
  const monaco = await loader.init()
  monaco.languages.register({id: "zed"})

  monaco.languages.setMonarchTokensProvider("zed", {
    keywords,
    operators,
    primitiveTypes,
    builtinAggFuncs,
    builtinFuncs,
    builtinOps,
    symbols,
    tokenizer: {
      root: [
        identifierRule,
        commentRule,
        bracketRule,
        operatorRule,
        integerRule,
        floatRule,
        stringRule,
      ],
    },
  })
}
