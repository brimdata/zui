import filter from "filter-console"

export async function initialize() {
  filter([
    // These are annoying warnings about the devtools that we can't remove.
    /ExtensionLoadWarning/,
  ])
}
