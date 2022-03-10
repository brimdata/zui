import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {lakeQueryPath} from "src/app/router/utils/paths"
import PrimaryButton from "src/js/components/common/buttons/PrimaryButton"
import Current from "src/js/state/Current"
import Tabs from "src/js/state/Tabs"
import {AppDispatch} from "src/js/state/types"
import styled from "styled-components"
import {newQuery} from "../query-home/flows/new-query"

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
  const pool = useSelector(Current.mustGetPool)
  const lakeId = useSelector(Current.getLakeId)

  const openNewDraftQuery = () => {
    const query = dispatch(newQuery({pins: {from: pool.id, filters: []}}))
    dispatch(Tabs.new(lakeQueryPath(query.id, lakeId, {isDraft: true})))
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
