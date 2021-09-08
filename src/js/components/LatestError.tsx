import React from "react"
import {useSelector} from "react-redux"
import {reactElementProps} from "../../../test/integration/helpers/integration"
import {first} from "../lib/Array"
import Errors from "../state/Errors"

export function LatestError() {
  const error = first(useSelector(Errors.getErrors))
  const message = error ? `${error.type}: ${error.message}` : ""

  return (
    <div className="latest-error" {...reactElementProps("notification")}>
      {message}
    </div>
  )
}
