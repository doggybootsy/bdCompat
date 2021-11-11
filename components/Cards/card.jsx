import React, { memo, useState } from "react"
import { getModule, contextMenu } from "@vizality/webpack"
import { LazyImage, OverflowTooltip, Icon, Anchor, Switch, ContextMenu } from "@vizality/components"
import BdApi from "../../modules/BdApi"
import SettingsModal from "../SettingsModal"

const { openModal } = getModule("openModal", "openModalLazy")
const Button = getModule("ButtonLooks")

class Card extends React.Component {
  constructor(props) { 
    super(props)
    this.state = { active: BdApi.Plugins.isEnabled(this.props.plugin.id) }
  }
  render() {
    const { plugin, num, PWI, WarningIcons } = this.props
    function UninstallPlugin() {
      BdApi.showConfirmationModal(`Uninstall `, [`Are you sure you want to uninstall?`], {
        confirmText: "Uninstall",
        onConfirm: () => {
          BdApi.Plugins.getAll(true).addonsApi.deletePlugin(plugin)
        }
      })
    }
    function OpenSettings() {
      const Content = plugin.exports.getSettingsPanel()
      console.log(Content);
      try { openModal(props => <SettingsModal modalProps={props} Title={plugin.name}>Not showing so discord doesnt crash</SettingsModal>) }
      catch (e) { console.log(e) }
    }
    function togglePlugin() {
      this.setState({ active: !this.state.active })
      BdApi.Plugins.toggle(plugin.name)
    }
    const Context = memo(() => {
      const [active, setActive] = useState(this.state.active)
      return (
        <ContextMenu.Menu navId="vz-addon-context-menu" onClose={contextMenu.closeContextMenu}>
          <ContextMenu.CheckboxItem 
            id="Enable"
            label="Enable"
            checked={active}
            action={() => {
              setActive(!active)
              togglePlugin.call(this)
            }}
          />
          <ContextMenu.Separator />
          <ContextMenu.Item 
            id="Settings"
            label="Settings"
            action={OpenSettings}
            disabled={!(this.state.active && (typeof plugin.exports.getSettingsPanel === "function"))}
          />
          <ContextMenu.Separator />
          <ContextMenu.Item 
            id="Uninstall"
            label="Uninstall"
            action={UninstallPlugin}
            color={ContextMenu.Item.Colors.DANGER}
          />
        </ContextMenu.Menu>
      )
    })
    const handleContextMenu = evt => { return contextMenu.openContextMenu(evt, () => <Context /> ) }
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
                    {(!!plugin.authorLink || plugin.authorLink == "undefined") ? (
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
                    {(!!plugin.website) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="Globe"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Website"
                          onClick={() => window.open(plugin.website)}
                        />
                      </div>
                    )}
                    {(!!plugin.source) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="GitHub"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Source"
                          onClick={() => window.open(plugin.source)}
                        />
                      </div>
                    )}
                    {(!!plugin.invite) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="HelpCircle"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Support Server"
                          onClick={() => window.open(plugin.invite)}
                        />
                      </div>
                    )}
                    {(!!plugin.donate) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="Store"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Donate"
                          onClick={() => window.open(plugin.donate)}
                        />
                      </div>
                    )}
                    {(!!plugin.patreon) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="Chest"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Patreon"
                          onClick={() => window.open(plugin.patreon)}
                        />
                      </div>
                    )}
                    {(!(!PWI.filter(e => e === plugin.id).length) && WarningIcons) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          // Matches the comfy theme so
                          name={BdApi.Themes.isEnabled("comfy") ? "WarningBox" : "WarningCircle"}
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip={`${plugin.name} is known to cause issues`}
                        />
                      </div>
                    )}
                    {(this.state.active && (typeof plugin.exports.getSettingsPanel === "function")) && (
                      <div className="vz-addon-card-settings-button">
                        <Icon 
                          name="Gear"
                          className="vz-addon-card-uninstall-button-icon"
                          tooltip="Settings"
                          onClick={OpenSettings}
                        />
                      </div>
                    )}
                    <div className="vz-addon-card-toggle-wrapper">
                      <Switch 
                        className="vz-addon-card-toggle"
                        checked={this.state.active}
                        onChange={() => togglePlugin.call(this)}
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
  }
}

export default Card