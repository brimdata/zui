import useResizeObserver from "use-resize-observer"

const parentStyles = {
  display: "flex",
  outline: "1px solid blue",
  background: "red",
  height: "100%",
}

export function AutoSize(props: {children: any}) {
  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  return (
    <div ref={ref} style={parentStyles}>
      {props.children({width, height})}
    </div>
  )
}
