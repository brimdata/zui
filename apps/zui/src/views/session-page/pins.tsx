import styles from "./pins.module.css"

export function Pins() {
  return (
    <div className={styles.container}>
      <button className={styles.pin}>
        <span>from</span> checking.csv
      </button>
      <button className={styles.pin}>
        <span>filter</span> {"!grep('personal')"}
      </button>
    </div>
  )
}
