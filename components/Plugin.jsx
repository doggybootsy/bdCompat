import { Icon } from "@vizality/components"

const fs = require('fs')

const { shell: { openExternal } } = require("electron")

const { React, getModule }  = require("@vizality/webpack")
const { Switch } = require("@vizality/components")
const { openModal } = getModule("openModal")
const { Messages } = getModule("Messages")
const SettingsModal = require("./PluginSettings.jsx")
const { ModalRoot, ModalSize } = getModule("ModalRoot")

const Button = getModule("ButtonLooks")

module.exports = class Plugin extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.meta.__started})
  }
  render () {
    return (
      <>
        <div class="vz-addon-card" vz-addon-id="addon-installer" vz-addon-type="plugin"><div class="vz-addon-card-header-wrapper">
          <div class="vz-addon-card-content-wrapper">
            <div class="vz-addon-card-content">
              <div class="vz-addon-card-header">
                <div class="vz-addon-card-metadata">
                  <div class="vz-addon-card-name-version">
                    <div class="vz-overflow-tooltip vz-addon-card-name">{this.props.plugin.getName()}</div>
                    <span class="vz-addon-card-version">{this.props.meta.version}</span>
                  </div>
                  <div class="vz-overflow-tooltip vz-addon-card-author-wrapper" aria-label={this.props.meta.author}>
                    <vizality.modules.components.Anchor 
                      type='user'
                      userId={this.props.meta?.authorId}
                      className='vz-addon-card-author'>{this.props.meta.author}</vizality.modules.components.Anchor>
                  </div>
                </div>
              </div>
              <div class="vz-addon-card-description">{this.props.meta.description}</div>
                <div class="vz-addon-card-footer-wrapper">
                  <div class="vz-addon-card-footer">
                    <div class="vz-addon-card-footer-section-left">
                      <div class="vz-addon-card-uninstall">
                        <Button.default
                          size={Button.ButtonSizes.ICON}
                          color={Button.ButtonColors.RED}
                          onClick={() => BdApi.showConfirmationModal(`Uninstall ${this.props.plugin.getName()}`, [`Are you sure you wan't to uninstall ${this.props.plugin.getName()}`], {danger: true, confirmText: "Uninstall", onConfirm: () => {onDelete()}})}
                        >
                          <div class="contents-18-Yxp">
                            <Icon name="Trash" tooltip="Uninstall"/>
                          </div>
                        </Button.default>
                      </div>
                    </div>
                    <div class="vz-addon-card-footer-section-right">
                      {(typeof this.props.plugin.getSettingsPanel === "function" && this.state.enabled) && (
                          <Icon
                            className="vz-addon-card-settings-button-icon-wrapper"
                            iconClassName="vz-addon-card-settings-button-icon"
                            name="Gear"
                            tooltip="Settings"
                            onClick={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={this.props.plugin} modalProps={props}/></ModalRoot>))}
                          />
                      )}
                      <Switch checked={this.state.enabled} onChange={() => {
                        this.setState({enabled: !this.state.enabled})
                        this.togglePlugin()}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  togglePlugin () {
    if (this.state.enabled) {
      this.props.onDisable()
    } else {
      this.props.onEnable()
    }

    this.forceUpdate()
  }
}