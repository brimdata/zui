import React from "react"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {ActiveQuery} from "./active-query"
import {HeadingAnonymous} from "./heading-anonymous"
import HeadingForm from "./heading-form"
import {HeadingSaved} from "./heading-saved"

export function Heading({active}: {active: ActiveQuery}) {
  const isEditing = useSelector(Layout.getIsEditingTitle)
  if (isEditing) {
    return <HeadingForm active={active} />
  } else if (active.isAnonymous()) {
    return <HeadingAnonymous />
  } else {
    return <HeadingSaved active={active} />
  }
}
