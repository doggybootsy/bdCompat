import React, { memo, useState } from "react";
import { SwitchItem } from "@vizality/components/settings"

const Tooltip = BdApi.findModuleByPrototypes("renderTooltip")
const Flex = BdApi.findModuleByDisplayName("Flex")
const { keybindShortcut } = BdApi.findModuleByProps("keybindShortcut")

function showAllToastTypes() { for (const type of ["success","info","warn","warning","danger","error","default"]) { BdApi.showToast(type, { type: type === "default" ? "" : type }) } }

export default memo(({ settings }) => {
  const [showToast, setShowToast] = useState(BdApi.isSettingEnabled("settings", "general","showToasts"))
  const [WarningIcons, setWarningIcons] = useState(settings.get("WarningIcons", true))
  return (
    <>
      <SwitchItem 
        description={<Flex>Show BetterDiscord's toast system <div style={{marginLeft: "10px"}}/>
          <div class={`${keybindShortcut}`}>
            <Tooltip text={showToast ? "Will show all toast's" : "Wont show all toast's"}>
              {TtProps => <span {...TtProps} onClick={showAllToastTypes}>DEMO</span>}
            </Tooltip>
          </div>
        </Flex>}
        value={showToast}
        info="Some toast's will show! Plugin's can force show them"
        onChange={() => {
          BdApi.toggleSetting("settings", "general", "showToasts")
          setShowToast(!showToast)
        }}
      >Show Toast's</SwitchItem>
      <SwitchItem 
        description="Small icon's saying issue's with a plugin"
        value={WarningIcons}
        info="Doe's nothing atm!"
        onChange={() => {
          setWarningIcons(!WarningIcons)
          settings.toggle("WarningIcons", true)
        }}
      >Warning Icon's On Card's</SwitchItem>
    </>
  )
})
