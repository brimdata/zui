import classNames from "classnames"
import styles from "./error-well.module.css"
import {errorToString} from "src/util/error-to-string"
import {Fragment} from "react"

export function ErrorWell(props: {
  title?: string
  error?: unknown
  className?: string
  children?: any
}) {
  const {title, error, className, children, ...rest} = props
  return (
    <div className={classNames(styles.error, className)} {...rest}>
      {title && <h3 className={styles.errorTitle}>{title}</h3>}
      {error && (
        <p>
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
      )}
      {children}
    </div>
  )
}
