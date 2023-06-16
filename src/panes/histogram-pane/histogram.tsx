import {Chart} from "./chart"
import {Error} from "./error"
import {useDataProps, validateDataProps} from "./use-data-props"

export function Histogram(props: {width: number; height: number}) {
  const dataProps = useDataProps()
  const error = validateDataProps(dataProps)
  if (error) {
    return <Error message={error} />
  } else {
    return <Chart {...dataProps} {...props} />
  }
}
