import {nanoid} from "@reduxjs/toolkit"
import {DRAFT_QUERY_NAME} from "src/app/query-home/utils/brim-query"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {useDispatch, useSelector} from "react-redux"
import React from "react"
import {useHistory} from "react-router"
import {Query} from "src/js/state/Queries/types"
import styled from "styled-components"
import PrimaryButton from "src/js/components/common/buttons/PrimaryButton"
import {AppDispatch} from "src/js/state/types"
import Current from "src/js/state/Current"
import DraftQueries from "src/js/state/DraftQueries"

const Wrap = styled.section`
  display: flex;
  height: 100%;
  max-width: 600px;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 100px;
`

const SubmitWrap = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
`
const PoolHome = () => {
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const pool = useSelector(Current.mustGetPool)
  const lakeId = useSelector(Current.getLakeId)

  const openNewDraftQuery = () => {
    const newDraft: Query = {
      id: nanoid(),
      name: DRAFT_QUERY_NAME,
      value: "",
      pins: {
        from: pool.id,
        filters: []
      }
    }
    dispatch(DraftQueries.set(newDraft))
    history.push(lakeQueryPath(newDraft.id, lakeId, {isDraft: true}))
  }

  const rawPoolData = Object.entries(pool.data).map(([key, value]) => (
    <div key={key}>
      <strong>{key}</strong>: {JSON.stringify(value) || "N/A"}
    </div>
  ))

  return (
    <Wrap>
      <h2>Pool Details</h2>
      <div>{rawPoolData}</div>
      <SubmitWrap>
        <PrimaryButton onClick={openNewDraftQuery}>Query Pool</PrimaryButton>
      </SubmitWrap>
    </Wrap>
  )
}

export default PoolHome
