export function FeatureFlag(props: {
  name: string
  on: JSX.Element
  off?: JSX.Element
}) {
  return featureIsEnabled(props.name) ? props.on : props.off || null
}

function featureIsEnabled(name: string) {
  return global.featureFlags.includes(name)
}
