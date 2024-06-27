import classNames from "classnames"
import styles from "./error-well.module.css"
import {ErrorLines} from "./errors-lines"

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
      {error && <ErrorLines error={error} />}
      {children}
    </div>
  )
}
