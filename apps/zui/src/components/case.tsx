export function Case(props: {if: boolean; true: any; false: any}) {
  if (props.if) {
    return props.true
  } else {
    return props.false
  }
}
