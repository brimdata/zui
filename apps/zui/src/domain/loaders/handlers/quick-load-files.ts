import {createHandler} from "src/core/handlers"
import {errorToString} from "src/util/error-to-string"

export const quickLoadFiles = createHandler((ctx, files: string[]) => {
  const promise = ctx.invoke("loaders.quickLoad", files)
  ctx.toast.promise(promise, {
    loading: `Loading data...`,
    success: (result) => `Successfully loaded data into ${result.name}`,
    error: (e) => "Load error: " + errorToString(e),
  })
})
