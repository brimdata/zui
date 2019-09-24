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
import * as Time from "../lib/Time"
import Toggle from "./Toggle"

export default function SettingsModal() {
  let dispatch = useDispatch()
  let timeZone = useSelector(getTimeZone)
  let useBoomIndex = useSelector(getUseBoomIndex)
  let useBoomCache = useSelector(getUseBoomCache)

  return (
    <ModalBox name="settings" title="Preferences" buttons="Ok">
      <TextContent>
        <div className="settings-form">
          <div className="setting-panel">
            <Label>Timezone:</Label>
            <select
              onChange={(e) => dispatch(setTimeZone(e.target.value))}
              value={timeZone}
            >
              {Time.zones().map((name) => (
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
            />
          </div>

          <div className="setting-panel">
            <Label>Enable Index Lookups:</Label>
            <Toggle
              checked={useBoomIndex}
              onChange={() => dispatch(enableIndex(!useBoomIndex))}
            />
          </div>
        </div>
      </TextContent>
    </ModalBox>
  )
}
