import React, { memo, useState, Fragment } from "react"
import { SwitchItem } from "@vizality/components/settings"
import BdApi from "../modules/BDApi";

export default memo(({ getSetting:get, updateSetting:set, toggleSetting:toggle }) => {
  const [showToast, setShowToast] = useState(BdApi.isSettingEnabled("settings", "general", "showToasts"))
  const Tooltip = BdApi.findModuleByPrototypes("renderTooltip")
  const Flex = BdApi.findModuleByDisplayName("Flex")
  const { keybindShortcut } = BdApi.findModuleByProps("keybindShortcut")
  function showAllToastTypes() {
    for (const type of ["success","info","warn","warning","danger","error","default"]) {
      BdApi.showToast(type, { type: type === "default" ? "" : type })
    }
  }
  return (
    <>
      <SwitchItem 
        description={<Flex>Show Betterdiscords toast <div style={{marginLeft: "10px"}}/>
          <div class={`${keybindShortcut}`}><Tooltip text={showToast ? "Will show all toast's" : "Wont show all toast's"}>
              {TtProps => <span {...TtProps} onClick={showAllToastTypes}>DEMO</span>}
            </Tooltip></div></Flex>}
        value={showToast}
        onChange={() => {
          BdApi.toggleSetting("settings", "general", "showToasts")
          setShowToast(!showToast)
        }}
      >Show Toasts</SwitchItem>
    </>
  )
})
