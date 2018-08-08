import React from "react"

const FieldsTable = ({log, only}) => {
  const rows = []
  const {tuple, descriptor} = log

  if (only) {
    only.forEach(name => {
      const field = log.getField(name)
      if (field) {
        const {value, type} = field
        rows.push(
          <FieldsTableRow key={name} name={name} value={value} type={type} />
        )
      }
    })
  } else {
    for (let index = 1; index < tuple.length; index++) {
      const value = tuple[index]
      const {name, type} = descriptor[index]
      rows.push(
        <FieldsTableRow key={name} name={name} value={value} type={type} />
      )
    }
  }

  return (
    <table className="fields-table">
      <tbody>{rows}</tbody>
    </table>
  )
}

export const FieldsTableRow = ({value, type, name}) => (
  <tr>
    <th>{name}</th>
    <td className={type}>{value}</td>
  </tr>
)

export default FieldsTable
