export async function initialize() {
  const filter = (await import("filter-console")).default

  filter([
    // These are annoying warnings about the devtools that we can't remove.
    /ExtensionLoadWarning/,
  ])
}
