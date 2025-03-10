import React from "react"
import {Pool} from "src/models/pool"
import styles from "./details.module.css"
import classNames from "classnames"

export function Details({pool}: {pool: Pool}) {
  const keys = pool.keys.map((k) => (k ? k.join(".") : "null"))
  return (
    <section className="stack-0">
      <h3>Pool Details</h3>
      <div className={classNames(styles.list, "stack--1")}>
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
