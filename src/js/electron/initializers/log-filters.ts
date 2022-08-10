export async function initialize() {
  // Since this is an ESM only module, we've got to do this...
  const filter = (await import("filter-console")).default

  filter([
    // These are annoying warnings about the devtools that we can't remove.
    /ExtensionLoadWarning/,
  ])
}
