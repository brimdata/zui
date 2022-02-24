import {lakePath} from "src/app/router/utils/paths"
import React from "react"
import {useSelector} from "react-redux"
import {useHistory} from "react-router"
import {BrimLake} from "src/js/brim"
import lake from "src/js/brim/lake"
import DataStoreIcon from "src/js/icons/DataStoreIcon"
import Lakes from "src/js/state/Lakes"
import styled from "styled-components"

const StyledLake = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px;
  border-radius: 3px;
  min-width: 250px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const LakeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin: 0 12px;
`
const LakeName = styled.div`
  ${(p) => p.theme.typography.labelBold};
  color: var(--aqua);
  cursor: default;
`
const LakeAddress = styled.div`
  ${(p) => p.theme.typography.labelSmall};
  color: var(--slate);
  cursor: default;
`

type Props = {
  lake: BrimLake
  onClick: () => void
}

const Lake = ({lake, onClick}: Props) => {
  return (
    <StyledLake onClick={onClick}>
      <DataStoreIcon />
      <LakeInfo>
        <LakeName>{lake.name}</LakeName>
        <LakeAddress>{lake.getAddress()}</LakeAddress>
      </LakeInfo>
    </StyledLake>
  )
}

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: scroll;
`

const StyledHeader = styled.h1`
  margin: 96px 0 0 0;
  color: var(--aqua);
  ${(p) => p.theme.typography.headingPage}
`

const LakesWrapper = styled.ul`
  padding: 0;
`

const LakeList = () => {
  const lakes = useSelector(Lakes.all)
  const history = useHistory()
  return (
    <PageWrap>
      <StyledHeader>Choose a Lake</StyledHeader>
      <LakesWrapper>
        {lakes.map((l) => (
          <Lake
            key={l.id}
            lake={lake(l)}
            onClick={() => history.push(lakePath(l.id))}
          />
        ))}
      </LakesWrapper>
    </PageWrap>
  )
}

export default LakeList
