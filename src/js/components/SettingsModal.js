/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Label} from "./Typography"
import {getTimeZone} from "../state/reducers/view"
import {reactElementProps} from "../test/integration"
import {setTimeZone} from "../state/actions"
import Boomd from "../state/Boomd"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import Toggle from "./Toggle"
import brim from "../brim"

export default function SettingsModal() {
  let dispatch = useDispatch()
  let timeZone = useSelector(getTimeZone)
  let useBoomIndex = useSelector(Boomd.usingIndex)
  let useBoomCache = useSelector(Boomd.usingCache)

  return (
    <ModalBox
      name="settings"
      title="Preferences"
      buttons="Ok"
      {...reactElementProps("settingsModal")}
    >
      <TextContent>
        <div className="settings-form">
          <div className="setting-panel">
            <Label>Timezone:</Label>
            <select
              onChange={(e) => dispatch(setTimeZone(e.target.value))}
              value={timeZone}
            >
              {brim.time.getZoneNames().map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-panel">
            <Label>Enable Analytics Cache:</Label>
            <Toggle
              checked={useBoomCache}
              onChange={() => dispatch(Boomd.enableCache(!useBoomCache))}
              // Passthrough props with {...reactElementProps()} didn't work here.
              // I had to set this directly. Feel free to improve.
              dataTestLocator="useCacheToggle"
            />
          </div>

          <div className="setting-panel">
            <Label>Enable Index Lookups:</Label>
            <Toggle
              checked={useBoomIndex}
              onChange={() => dispatch(Boomd.enableIndex(!useBoomIndex))}
              dataTestLocator="useIndexToggle"
            />
          </div>
        </div>
      </TextContent>
    </ModalBox>
  )
}
