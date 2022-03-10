import React from "react"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import Current from "src/js/state/Current"
import {getQuerySource} from "../flows/get-query-source"

const Row = styled.div`
  display: flex;
  align-items: center;
`

const TitleHeader = styled(Row)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 4px;
`

const Title = styled.h2`
  ${(props) => props.theme.typography.labelBold}
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Source = styled.p`
  ${(props) => props.theme.typography.labelNormal}
  margin: 3px 0 0;
  color: rgba(0, 0, 0, 0.5);
  text-transform: capitalize;
`

const QueryPageTitle = () => {
  const dispatch = useDispatch()
  const query = useSelector(Current.getQuery)
  const querySource = dispatch(getQuerySource(query?.id))
  return (
    <TitleHeader>
      <Title>{query?.name}</Title>
      <Source>{querySource}</Source>
    </TitleHeader>
  )
}

export default QueryPageTitle
