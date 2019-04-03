/* @flow */
import React from "react"

type Props = {
  title: string
}

const AdminTitle = ({title}: Props) => (
  <div className="admin-title">
    <h1>{title}</h1>
  </div>
)

export default AdminTitle
