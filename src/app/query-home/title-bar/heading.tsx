import React from "react"
import {ActiveQuery} from "./active-query"
import {HeadingAnonymous} from "./heading-anonymous"
import HeadingForm from "./heading-form"
import {HeadingSaved} from "./heading-saved"

export function Heading({query}: {query: ActiveQuery}) {
  return <HeadingForm query={query} />
  if (query.isAnonymous()) return <HeadingAnonymous />
  else return <HeadingSaved active={query} />
}
