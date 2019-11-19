/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Label} from "./Typography"
import {enableCache, enableIndex} from "../state/thunks/boomd"
import {getTimeZone} from "../state/reducers/view"
import {getUseBoomCache, getUseBoomIndex} from "../state/reducers/boomd"
import {setTimeZone} from "../state/actions"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import Toggle from "./Toggle"
import brim from "../brim"

import {reactElementProps} from "../test/integration"

export default function SettingsModal() {
  let dispatch = useDispatch()
  let timeZone = useSelector(getTimeZone)
  let useBoomIndex = useSelector(getUseBoomIndex)
  let useBoomCache = useSelector(getUseBoomCache)

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
              onChange={() => dispatch(enableCache(!useBoomCache))}
              // Passthrough props with {...reactElementProps()} didn't work here.
              // I had to set this directly. Feel free to improve.
              dataTestLocator="useCacheToggle"
            />
          </div>

          <div className="setting-panel">
            <Label>Enable Index Lookups:</Label>
            <Toggle
              checked={useBoomIndex}
              onChange={() => dispatch(enableIndex(!useBoomIndex))}
              dataTestLocator="useIndexToggle"
            />
          </div>
        </div>
      </TextContent>
    </ModalBox>
  )
}
