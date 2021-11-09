import React, { memo, useState } from "react"
import { getModule, contextMenu } from "@vizality/webpack"
import { LazyImage, OverflowTooltip, Icon, Anchor, Switch, ContextMenu } from "@vizality/components"
import BdApi from "../../modules/BdApi"

const Button = getModule("ButtonLooks")

const Context = memo(({ setIsActive, isActive, onChange, plugin, UninstallPlugin }) => {
  return (
    <ContextMenu.Menu navId="vz-addon-context-menu" onClose={contextMenu.closeContextMenu}>
      <ContextMenu.CheckboxItem 
        id="Enable"
        label="Enable"
        checked={isActive}
        action={onChange}
      />
      <ContextMenu.Separator />
      <ContextMenu.Item 
        id="Settings"
        label="Settings"
        action={() => openModal(props => (
          <SettingsModal modalProps={props} Title={plugin.name}>
            {plugin.exports.getSettingsPanel()}
          </SettingsModal>
        ))}
        disabled={!(isActive && (typeof plugin.exports.getSettingsPanel === "function"))}
      />
      <ContextMenu.Separator />
      <ContextMenu.Item 
        id="Uninstall"
        label="Uninstall"
        action={UninstallPlugin}
      />
    </ContextMenu.Menu>
  )
})

export default memo(({ plugin, num, PWI, WarningIcons }) => {
  const [isActive, setIsActive] = useState(BdApi.Plugins.isEnabled(plugin.id))
  function UninstallPlugin() {
    BdApi.showConfirmationModal(`Uninstall `, [`Are you sure you want to uninstall?`], {
      confirmText: "Uninstall",
      onConfirm: () => BdApi.showToast("Atm uninstalling plugins doesnt exist", { type: "warning" })
    })
  }
  const handleContextMenu = evt => {
    return contextMenu.openContextMenu(evt, () =>
      <Context 
        plugin={plugin}
        UninstallPlugin={UninstallPlugin}
        setIsActive={setIsActive}
        isActive={isActive}
        onChange={() => {
          setIsActive(!isActive)
          BdApi.Plugins.toggle(plugin.name)
        }}
      />
    )
  }
  return (
    <div className="vz-addon-card" onContextMenu={handleContextMenu}>
      <div className="vz-addon-card-header-wrapper">
        <div className="vz-addon-card-content-wrapper">
          <div className="vz-addon-card-content">
            <div className="vz-addon-card-header">
              <div className="vz-addon-card-icon">
                <LazyImage
                  src={`vizality://assets/images/default-plugin-${num}.png?width=0&height=0`}
                  alt={plugin.name}
                  className="vz-addon-card-icon-image-wrapper"
                  imageClassName="vz-addon-card-icon-img"
                />
              </div>
              <div className="vz-addon-card-metadata">
                <div className="vz-addon-card-name-version">
                  <OverflowTooltip
                    text={plugin.name}
                    className="vz-addon-card-name"
                  >{plugin.name}</OverflowTooltip>
                  <span className="vz-addon-card-version">{plugin.version}</span>
                </div>
                <OverflowTooltip className="vz-addon-card-author-wrapper" text={plugin.author}>
                  {(plugin.authorLink == undefined || plugin.authorLink == "undefined") ? (
                    <Anchor 
                      type="user" 
                      userId={plugin?.authorId} 
                      className="vz-addon-card-author"
                    >{plugin.author}</Anchor>
                    ) : (
                    <Anchor 
                      style={{pointerEvents: "all"}}
                      className="vz-addon-card-author"
                      href={plugin.authorLink}
                    >{plugin.author}</Anchor>
                  )}
                </OverflowTooltip>
              </div>
            </div>
            <div className="vz-addon-card-description">{plugin.description}</div>
            <div className="vz-addon-card-footer-wrapper">
              <div className="vz-addon-card-footer">
                <div className="vz-addon-card-footer-section-left">
                  <Button.default
                    className="vz-addon-card-uninstall-button"
                    color={Button.ButtonColors.RED}
                    size={Button.ButtonSizes.ICON}
                  >
                    <Icon 
                      name="Trash"
                      className="vz-addon-card-uninstall-button-icon"
                      tooltip="Uninstall"
                      onClick={UninstallPlugin}
                    />
                  </Button.default>
                </div>
                <div className="vz-addon-card-footer-section-right">
                  {(!(!PWI.filter(e => e === plugin.id).length) && WarningIcons) && (
                    <div className="vz-addon-card-settings-button">
                      <Icon 
                        // Matches the comfy theme so
                        name={BdApi.Themes.isEnabled("comfy") ? "WarningBox" : "WarningCircle"}
                        className="vz-addon-card-uninstall-button-icon"
                        tooltip="Known to cause issues"
                      />
                    </div>
                  )}
                  {(plugin.exports.getSettingsPanel && isActive) && (
                    <div className="vz-addon-card-settings-button">
                      <Icon 
                        name="Gear"
                        className="vz-addon-card-uninstall-button-icon"
                        tooltip="Settings"
                        onClick={() => openModal(props => (
                          <SettingsModal modalProps={props} Title={plugin.name}>
                            {plugin.exports.getSettingsPanel()}
                          </SettingsModal>
                        ))}
                      />
                    </div>
                  )}
                  <div className="vz-addon-card-toggle-wrapper">
                    <Switch 
                      className="vz-addon-card-toggle"
                      checked={isActive}
                      onChange={() => {
                        setIsActive(!isActive)
                        BdApi.Plugins.toggle(plugin.name)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})