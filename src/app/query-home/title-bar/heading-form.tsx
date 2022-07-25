import React, {useEffect, useRef} from "react"
import styled from "styled-components"
import {ActiveQuery} from "./active-query"
import {Button} from "./button"

const Form = styled.form`
  display: flex;
  gap: 4px;
`

const Input = styled.input`
  height: 22px;
  border: 2px solid var(--primary-color);
  font-size: 14px;
  font-weight: 700;
  padding 0 10px;
  border-radius: 6px;
  line-height: 22px;
  width: 400px;
  margin-right: 6px;
`

export default function HeadingForm({query}: {query: ActiveQuery}) {
  const input = useRef<HTMLInputElement>()
  useEffect(() => {
    input.current.setSelectionRange(0, input.current.value.length)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input autoFocus defaultValue={query.name()} ref={input} />
      <Button icon="check" primary>
        Save
      </Button>
      <Button>Cancel</Button>
    </Form>
  )
}

// const TitleInput = ({onCancel, onSubmit}) => {
//   const inputRef = useRef(null)
//   const query = useSelector(Current.getQuery)
//   const [queryTitle, setQueryTitle] = useState(query?.name)

//   const handleEdit = () => {
//     if (!queryTitle) onCancel()
//     else onSubmit(queryTitle)
//   }

//   useEnterKey(() => {
//     handleEdit()
//   })
//   useEscapeKey(() => {
//     onCancel()
//   })
//   useEffect(() => {
//     setQueryTitle(query?.name)
//   }, [query])
//   useLayoutEffect(() => {
//     inputRef.current && inputRef.current.select()
//   }, [])

//   return (
//     <StyledTitleWrapper>
//       <AutosizeInput
//         ref={inputRef}
//         onChange={(e) => setQueryTitle(e.target.value)}
//         value={queryTitle || ""}
//         style={{
//           overflow: "hidden",
//           background: cssVar("--input-background"),
//           borderRadius: "3px",
//           padding: "2px 6px",
//           margin: "-2px 0 1px -6px",
//         }}
//         inputStyle={{
//           background: "transparent",
//           margin: 0,
//           padding: 0,
//           fontWeight: 700,
//           fontSize: "14px",
//           letterSpacing: 0,
//           lineHeight: "24px",
//           display: "block",
//           outline: "none",
//           border: "none",
//         }}
//       />
//       <StyledAnchor isPrimary isIndented onClick={handleEdit}>
//         Save
//       </StyledAnchor>
//       <StyledAnchor isIndented onClick={onCancel}>
//         Cancel
//       </StyledAnchor>
//     </StyledTitleWrapper>
//   )
// }

// const onSubmit = (newTitle) => {
//     setIsEditing(false)
//     if (newTitle !== "") {
//       if (isSession) {
//         const q = dispatch(
//           Queries.create({...query.latestVersion(), name: newTitle})
//         )
//         dispatch(
//           tabHistory.push(lakeQueryPath(q.id, lakeId, q.latestVersionId()))
//         )
//         dispatch(SessionHistories.push(q.id))
//       } else {
//         const newQuery = {...query.serialize(), name: newTitle}
//         dispatch(updateQuery(query, newQuery))
//       }
//     }
//   }

//   const doUpdate = (id, isPush = true) => {
//     const versionCopy = {...cloneDeep(version), version: nanoid()}
//     dispatch(
//       QueryVersions.add({
//         queryId: id,
//         version: versionCopy,
//       })
//     )

//     if (isPush) {
//       dispatch(SessionHistories.push(id, versionCopy.version))
//       dispatch(tabHistory.push(lakeQueryPath(id, lakeId, versionCopy.version)))
//     } else {
//       dispatch(SessionHistories.replace(id, versionCopy.version))
//       dispatch(
//         tabHistory.replace(lakeQueryPath(id, lakeId, versionCopy.version))
//       )
//     }
//   }

//   const handleUpdate = () => doUpdate(query.id, false)
//   const handleDetach = () => doUpdate(tabId)
