import {FileLoader} from "./file-loader"
import {LoadContext} from "./load-context"
import {QueryLoader} from "./query-loader"
import {LoaderRef} from "./types"

export const DEFAULT_LOADERS = [
  {
    name: "fileLoader",
    initialize: (ctx: LoadContext) => new FileLoader(ctx),
  },
  {
    name: "queryLoader",
    initialize: (ctx: LoadContext) => new QueryLoader(ctx),
  },
] as LoaderRef[]
