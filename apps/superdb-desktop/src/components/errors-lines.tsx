import {Fragment} from "react"
import {arrayWrap} from "src/util/array-wrap"
import {errorToString} from "src/util/error-to-string"

export function ErrorLines(props: {error: unknown | unknown[]}) {
  return (
    <>
      {arrayWrap(props.error).map((error, i) => {
        return (
          <p key={i}>
            {errorToString(error)
              .replaceAll("Error:", "")
              .trim()
              .split("\n")
              .map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
          </p>
        )
      })}
    </>
  )
}
