import React from "react"
import {Pool} from "src/app/core/pools/pool"
import styles from "./details.module.css"

export function Details({pool}: {pool: Pool}) {
  const keys = pool.keys.map((k) => k.join("."))
  return (
    <section className={styles.details}>
      <h2 className={styles.title}>Pool Details</h2>
      <div className={styles.list}>
        <dl>
          <dt>ID </dt>
          <dd>{pool.id}</dd>
        </dl>
        <dl>
          <dt>Layout Key{keys.length > 1 ? "s" : null} </dt>
          <dd>{keys.join(", ") || "null"}</dd>
        </dl>
        <dl>
          <dt>Layout Order </dt>
          <dd>{pool.data.layout.order}</dd>
        </dl>
        <dl>
          <dt>Timestamp </dt>
          <dd>{pool.data.ts.toLocaleString()}</dd>
        </dl>
      </div>
    </section>
  )
}
