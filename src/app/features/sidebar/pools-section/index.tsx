import {useImportOnDrop} from "src/app/features/import/use-import-on-drop"
import get from "lodash/get"
import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Current from "src/js/state/Current"
import LakeStatuses from "src/js/state/LakeStatuses"
import {
  SectionContents,
  StyledSection,
  DropOverlay,
  SectionSearch,
} from "../common"
import EmptySection from "src/js/components/common/EmptySection"
import styled from "styled-components"
import {Tree} from "react-arborist"
import {useSectionTreeDefaults} from "../hooks"
import PoolItem from "./pool-item"
import renamePool from "src/js/flows/renamePool"
import {Pool} from "src/app/core/pools/pool"
import Icon from "src/app/core/icon-temp"

const StyledEmptySection = styled(EmptySection).attrs({
  icon: <Icon name="pool" />,
})``

const poolSearch = (term: string, items: Pool[]): Pool[] => {
  return items.filter(({name}) =>
    JSON.stringify({name}).toLowerCase().includes(term.toLowerCase())
  )
}

const PoolsSection = () => {
  const dispatch = useDispatch()
  const lake = useSelector(Current.getLake)
  const id = get(lake, ["id"], "")
  const lakeStatus = useSelector(LakeStatuses.get(id))
  const pools = useSelector(Current.getPools)
  const [filteredPools, setFilteredPools] = useState(pools)
  const [{isOver}, drop] = useImportOnDrop()
  const {resizeRef, defaults} = useSectionTreeDefaults()

  useEffect(() => {
    setFilteredPools(pools)
  }, [pools])

  const renderContents = () => {
    if (lakeStatus === "disconnected")
      return <StyledEmptySection message="Unable to connect to service." />
    if (lakeStatus === "login-required")
      return <StyledEmptySection message="Login required to view pools." />
    if (pools.length === 0)
      return (
        <StyledEmptySection message="You have no pools yet. Create a pool by importing data." />
      )
    if (filteredPools.length === 0)
      return <StyledEmptySection message="No pools match the search term." />

    const handleRename = (poolId: string, name: string) => {
      dispatch(renamePool(poolId, name))
    }

    return (
      <Tree
        {...defaults}
        data={{
          id: "root",
          items: filteredPools.sort((a, b) => (a.name > b.name ? 1 : -1)),
        }}
        onEdit={handleRename}
      >
        {PoolItem}
      </Tree>
    )
  }

  const onPoolSearch = (e) => {
    setFilteredPools(poolSearch(e.target?.value, pools))
  }

  return (
    <StyledSection>
      <SectionContents
        ref={(r) => {
          resizeRef(r)
          drop(r)
        }}
      >
        {renderContents()}
        <DropOverlay show={isOver}>Drop to import...</DropOverlay>
      </SectionContents>
      <SectionSearch placeholder="Search pools..." onChange={onPoolSearch} />
    </StyledSection>
  )
}

export default PoolsSection
