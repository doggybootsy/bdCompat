import React, { memo } from "react"
import { StickyElement, Icon, ContextMenu } from "@vizality/components"
import { contextMenu } from "@vizality/webpack"
import BdSettings from "./BdSettings"

import BdApi from "../modules/BdApi";
import SettingsModal from "./SettingsModal"

const { openModal } = BdApi.findModuleByProps("openModal", "openModalLazy")

export default memo(({ getSetting:get, updateSetting:set, toggleSetting:toggle }) => {
  const plugins = BdApi.Plugins.getAll()
  const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
  const Card = require(`./Cards/${display}.jsx`).default
  let num = 0
  const PWI = ["GifSaver", "BDFDB"]
  return (
    <>
      <div className="vz-addons-list" vz-card={display}>
        <StickyElement className="vz-addons-list-sticky-bar">
          <div className="vz-addons-list-search-options">
            <div className="vz-addons-list-more-button vz-addons-list-search-options-button">
              <Icon name="Gear" tooltip="Open Setting's" onClick={() => {
                openModal(props => <SettingsModal modalProps={props} Title="BdCompat"><BdSettings settings={{get, set, toggle}}/></SettingsModal>)
              }}/>
            </div>
          </div>
        </StickyElement>
        <div className="vz-addons-list-inner">
          <div class="vz-addons-list-search-results-text-wrapper">
            <div class="vz-addons-list-search-results-text header-2RyJ0Y">
              <span class="vz-addons-list-search-results-count">{plugins.length}</span> plugins found
            </div>
          </div>
          <div className="vz-addons-list-items">
            {plugins.map(plugin => {
              num++
              if (num === 6) num = 1
              return (
                <Card plugin={plugin} num={num} PWI={PWI} WarningIcons={get("WarningIcons", true)} />
              )
            })}
            {Array.from({length: 8}, (_,i) => i).map(_ => <div className="vz-addon-card vz-addon-card-filler"/>)}
          </div>
        </div>
      </div>
    </>
  )
})