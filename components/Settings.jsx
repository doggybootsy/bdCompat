import React, { memo, useState } from "react"
import { StickyElement, Icon } from "@vizality/components"
import BdSettings from "./BdSettings"

import BdApi from "../modules/BdApi";
import SettingsModal from "./SettingsModal"

const { openModal } = BdApi.findModuleByProps("openModal", "openModalLazy")

export default memo(({ getSetting:get, updateSetting:set, toggleSetting:toggle }) => {
  const plugins = BdApi.Plugins.getAll()
  const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
  const Card = require(`./Cards/${display}.jsx`).default
  let imgNum = 0
  const PWI = ["GifSaver", "BDFDB"]
  const pluginPage = BdApi.Plugins.get(vizality.api.routes.getLocation().pathname.split("/").pop())
  // if page is to a bd plugin and if that plugin has a settings page, open that settings panel
  if (pluginPage?.exports?.getSettingsPanel) openModal(props => <SettingsModal modalProps={props} Title={plugin.name}>{plugin.exports.getSettingsPanel()}</SettingsModal>)
  let [num, setNum] = useState(0)
  function parents(element, selector = "") {
    const parents = [];
    if (selector) while (element.parentElement && element.parentElement.closest(selector)) parents.push(element = element.parentElement.closest(selector));
    else while (element.parentElement) parents.push(element = element.parentElement);
    return parents;
  }
  return (
    <>
      <div className="vz-addons-list" vz-card={display}>
        <StickyElement className="vz-addons-list-sticky-bar">
          <div className="vz-addons-list-search-options">
            {(get("RerenderButton", true)) && (
              <div className="vz-addons-list-tags-button vz-addons-list-search-options-button">
                <Icon name="Refresh" tooltip="Rerender" onClick={(ele) => {
                  for (const parent of parents(ele.target)) {
                    if (parent.className !== "vz-icon-wrapper") continue
                    parent.classList.add("vz-icon-spin")
                    setTimeout(() => parent.classList.remove("vz-icon-spin"), 1000)
                    setNum(num + 1)
                  }
                }}/>
              </div>
            )}
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
              imgNum++
              if (num === 6) num = 1
              return (
                <Card plugin={plugin} num={imgNum} PWI={PWI} WarningIcons={get("WarningIcons", true)} />
              )
            })}
            {Array.from({length: 8}, (_,i) => i).map(_ => <div className="vz-addon-card vz-addon-card-filler"/>)}
          </div>
        </div>
      </div>
    </>
  )
})