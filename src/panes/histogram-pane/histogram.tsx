import {useDataTransition} from "src/util/hooks/use-data-transition"
import {Chart} from "./chart"
import {Error} from "./error"
import {useDataProps, validateDataProps} from "./use-data-props"

export function Histogram(props: {width: number; height: number}) {
  const data = useDataProps()
  const dataProps = useDataTransition(
    data,
    data.isFetching && data.data.length === 0
  )
  const error = validateDataProps(dataProps)

  if (error) {
    return <Error message={error} />
  } else {
    return <Chart {...dataProps} {...props} />
  }
}
