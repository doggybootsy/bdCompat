import React, { memo, useState } from "react";
import { SwitchItem, Category } from "@vizality/components/settings"

const Tooltip = BdApi.findModuleByPrototypes("renderTooltip")
const Flex = BdApi.findModuleByDisplayName("Flex")
const { keybindShortcut } = BdApi.findModuleByProps("keybindShortcut")

function showAllToastTypes() { for (const type of ["success","info","warn","warning","danger","error","default"]) { BdApi.showToast(type, { type: type === "default" ? "" : type }) } }

export default memo(({ settings }) => {
  const [showToast, setShowToast] = useState(BdApi.isSettingEnabled("settings", "general","showToasts"))
  const [rerenderButton, setRerenderButton] = useState(settings.get("RerenderButton", true))
  const [WarningIcons, setWarningIcons] = useState(settings.get("WarningIcons", true))
  const [vizalityApiToast, setVizalityApiToast] = useState(settings.get("vizalityApiToast", false))
  return (
    <>
      <Category
        title="Tooltip's"
        className="bd-Category"
        icon="HelpOutline"
      >
        <SwitchItem 
          description={<Flex>Show BetterDiscord's toast system <div style={{marginLeft: "10px"}}/>
            <div class={keybindShortcut}>
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
          description="Use's Vizality's toast system instead of Bd's"
          value={vizalityApiToast}
          disabled={!showToast}
          onChange={() => {
            setVizalityApiToast(!vizalityApiToast)
            settings.toggle("vizalityApiToast", false)
          }}
        >Use Vizality's Toast Api</SwitchItem>
      </Category>
      <SwitchItem 
        description="Small icon's saying issue's with a plugin"
        value={WarningIcons}
        onChange={() => {
          setWarningIcons(!WarningIcons)
          settings.toggle("WarningIcons", true)
        }}
      >Warning Icon's On Card's</SwitchItem>
      <SwitchItem 
        description="Simple button to rerender the plugins page w/o going back and forth"
        value={rerenderButton}
        onChange={() => {
          setRerenderButton(!rerenderButton)
          settings.toggle("RerenderButton", true)
        }}
      >Rerender Button</SwitchItem>
    </>
  )
})