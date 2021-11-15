// import {zed} from "zealot"

// for (const value of props.values) {
//   inspect(value, null, 0, rows, expanded, setExpanded)
// }

// function inspect(
//   value: zed.AnyValue,
//   name: string | null,
//   indent: number,
//   rows: RowData[],
//   expanded: Map<zed.AnyValue, boolean>,
//   setExpanded: (map: Map<zed.AnyValue, boolean>) => void
// ) {
//   if (value instanceof zed.Record) {
//     if (value.fields === null) {
//       rows.push({indent, render: <span className="inspector-null">null</span>})
//     } else {
//       if (name) {
//         rows.push({
//           indent,
//           render: (
//             <>
//               <span className="inspector-key">{name}:</span>
//               {"{"}
//             </>
//           )
//         })
//       } else {
//         rows.push({indent, render: "{"})
//       }

//       for (const field of value.fields) {
//         inspect(
//           field.value,
//           field.name,
//           indent + 1,
//           rows,
//           expanded,
//           setExpanded
//         )
//       }
//       rows.push({indent, render: "}"})
//     }
//   } else if (value instanceof zed.Array) {
//     if (value.items === null) {
//       rows.push({indent, render: <span className="inspector-null">null</span>})
//     } else {
//       console.log(expanded.get(value))
//       if (name) {
//         rows.push({
//           indent,
//           render: (
//             <a
//               onClick={() => {
//                 expanded.set(value, !expanded.get(value))
//                 setExpanded(new Map(expanded.entries()))
//                 console.log(value)
//               }}
//             >
//               <span className="inspector-key">{name}:</span> [
//             </a>
//           )
//         })
//       } else {
//         rows.push({indent, render: "["})
//       }
//       for (const item of value.items) {
//         inspect(item, null, indent + 1, rows, expanded, setExpanded)
//       }
//       rows.push({indent, render: "]"})
//     }
//   } else if (value instanceof zed.String) {
//     if (name) {
//       rows.push({
//         indent,
//         render: (
//           <>
//             {name}:{" "}
//             <span className="inspector-string">"{value.toString()}"</span>
//           </>
//         )
//       })
//     } else {
//       rows.push({
//         indent,
//         render: <span className="inspector-string">"{value.toString()}"</span>
//       })
//     }
//   }
//   return rows
// }
