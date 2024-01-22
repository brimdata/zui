export function Show(props: {when: boolean; children: any}) {
  if (props.when) return props.children
  else return null
}
