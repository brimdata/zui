import React, {memo, ReactNode} from "react"
import InlineTableLoading from "src/js/components/InlineTableLoading"

type Props = {
  isLoading?: boolean
  children: ReactNode
}

export default memo<Props>(function Panel({isLoading, children}: Props) {
  return (
    <div>
      {isLoading ? (
        <div>
          <InlineTableLoading rows={3} />
        </div>
      ) : (
        children
      )}
    </div>
  )
})
