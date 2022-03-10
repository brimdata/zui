import ColumnsModal from "src/app/columns/columns-modal"
import env from "src/app/core/env"
import SpaceMigration from "src/app/legacy/space-migration/space-migration"
import HookLog from "src/app/system-test/HookLog"
import React from "react"
import BrimToaster from "src/js/components/BrimToaster"
import BrimTooltip from "src/js/components/BrimTooltip"
import ErrorNotice from "src/js/components/ErrorNotice"
import HTMLContextMenu from "src/js/components/HTMLContextMenu"
import {XLatestError} from "src/js/components/LatestError"
import {LeftPane} from "src/js/components/LeftPane"
import {Modals} from "src/js/components/Modals"
import PoolModal from "src/js/components/PoolModal"
import Preferences from "src/js/components/Preferences/Preferences"
import {XRightPane} from "src/js/components/RightPane"
import StatusBar from "src/js/components/StatusBar"
import TabBar from "src/js/components/TabBar/TabBar"
import styled from "styled-components"
import {FeatureFlag} from "../core/feature-flag"
import {Sidebar} from "src/app/features/sidebar"

const ColumnLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: column;
  position: relative;
`

const RowLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: row;
  position: relative;
  padding-top: 1px;
`

const SearchPageMain = styled.div`
  display: flex;
  height: 100%;
`

const SearchPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

export default function AppWrapper({children}) {
  return (
    <div className="app-wrapper">
      <div className="title-bar-drag-area" />
      <XLatestError />
      <SearchPageWrapper>
        <SearchPageMain>
          <ColumnLayout>
            <div id="modal-dialog-root" />
            <TabBar />
            <RowLayout>
              <FeatureFlag
                name="query-flow"
                on={<Sidebar />}
                off={<LeftPane />}
              />
              <ColumnLayout>{children}</ColumnLayout>
              <XRightPane />
            </RowLayout>
            <StatusBar />
          </ColumnLayout>
        </SearchPageMain>
      </SearchPageWrapper>

      {/* Global Modals */}
      <ErrorNotice />
      <Preferences />
      <Modals />
      <PoolModal />
      <ColumnsModal />
      <HTMLContextMenu />
      <BrimToaster />
      <BrimTooltip />
      <SpaceMigration />

      {env.isIntegrationTest && <HookLog />}
    </div>
  )
}
