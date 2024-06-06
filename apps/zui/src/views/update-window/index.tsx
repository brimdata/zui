import {useSelector} from "react-redux"
import Updates from "src/js/state/Updates"
import styles from "./index.module.css"
import classNames from "classnames"
import ProgressIndicator from "src/js/components/ProgressIndicator"
import {isNumber} from "lodash"
import {invoke} from "src/core/invoke"
import {errorToString} from "src/util/error-to-string"
import Link from "src/js/components/common/Link"

function useStatus() {
  const nextVersion = useSelector(Updates.getNextVersion)
  const isChecking = useSelector(Updates.isChecking)
  const isDownloading = useSelector(Updates.isDownloading)
  const error = useSelector(Updates.getError)

  if (isChecking) return "checking"
  if (error) return "error"
  if (isDownloading) return "downloading"
  if (nextVersion) return "available"
  if (!nextVersion) return "not-available"
}

function useTemplate() {
  let status = useStatus()
  const nextVersion = useSelector(Updates.getNextVersion)
  const downloadProgress = useSelector(Updates.getDownloadProgress)
  const error = useSelector(Updates.getError)
  const closeWindow = () => invoke("window.close", globalThis.windowId)
  const install = () => invoke("updates.install")
  const check = () => invoke("updates.check")
  switch (status) {
    case "error":
      return {
        title: "Error",
        text: errorToString(error),
        button: ["OK", closeWindow],
        submit: ["Try Again", check],
      }
    case "checking":
      return {
        title: "Checking for Updates...",
      }
    case "not-available":
      return {
        title: "Up to Date!",
        text: (
          <Link href={globalThis.appMeta.repository + "/releases"}>
            View releases
          </Link>
        ),
        button: ["OK", closeWindow],
      }
    case "available":
      return {
        title: "Update Available",
        text: `Version ${nextVersion}`,
        button: ["Later", closeWindow],
        submit: ["Install", install],
      }
    case "downloading":
      return {
        title: "Downloading...",
        text: "Zui will restart when download completes.",
        progress: downloadProgress,
      }
  }
}

export function UpdateWindow() {
  const data = useTemplate()
  const version = globalThis.appMeta.version

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <img src="/zui-icon.svg" width={80} height={80} alt="Zui Logo" />
        <p className={styles.subtext}>v{version}</p>
      </header>
      <main className={styles.main}>
        {data.title && <p className={styles.title}>{data.title}</p>}
        {data.text && <p className={styles.subtext}>{data.text}</p>}
        {isNumber(data.progress) && (
          <ProgressIndicator
            className={styles.progress}
            percent={data.progress}
          />
        )}
      </main>
      <footer className={classNames(styles.footer, "repel", "flex-nowrap")}>
        {data.button && (
          <button onClick={data.button[1] as any} className="button">
            {data.button[0] as string}
          </button>
        )}
        {data.submit && (
          <button onClick={data.submit[1] as any} className="button submit">
            {data.submit[0] as string}
          </button>
        )}
      </footer>
    </div>
  )
}
