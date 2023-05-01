import filter from "filter-console"
import env from "src/app/core/env"

export async function initialize() {
  if (env.isTest) return
  filter([
    // These are annoying warnings about the devtools that we can't remove.
    /ExtensionLoadWarning/,
  ])
}
