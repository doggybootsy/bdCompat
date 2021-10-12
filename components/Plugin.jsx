import { Icon, Switch } from "@vizality/components"
import { shell as eleShell } from "electron"
import { React, getModule } from "@vizality/webpack"
import SettingsModal from "./PluginSettings.jsx"

const { openModal } = getModule("openModal")
const { ModalRoot, ModalSize } = getModule("ModalRoot")
const Button = getModule("ButtonLooks")

module.exports = class Plugin extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.meta.__started})
  }
  render () {
    const name = this.props.plugin.getName() || this.props.meta.name
    const version = this.props.plugin.getVersion() || this.props.meta.version
    const author = this.props.plugin.getAuthor() || this.props.meta.author
    const description = this.props.plugin.getDescription() || this.props.meta.description
    return (
      <>
        <div class="vz-addon-card" vz-addon-id="addon-installer" vz-addon-type="plugin"><div class="vz-addon-card-header-wrapper">
          <div class="vz-addon-card-content-wrapper">
            <div class="vz-addon-card-content">
              <div class="vz-addon-card-header">
                <div class="vz-addon-card-metadata">
                  <div class="vz-addon-card-name-version">
                    <div class="vz-overflow-tooltip vz-addon-card-name">{name}</div>
                    <span class="vz-addon-card-version">{version}</span>
                  </div>
                  <div class="vz-overflow-tooltip vz-addon-card-author-wrapper" aria-label={author}>
                    <vizality.modules.components.Anchor 
                      type='user'
                      userId={this.props.meta?.authorId}
                      className='vz-addon-card-author'>{author}</vizality.modules.components.Anchor>
                  </div>
                </div>
              </div>
              <div class="vz-addon-card-description">{description}</div>
                <div class="vz-addon-card-footer-wrapper">
                  <div class="vz-addon-card-footer">
                    <div class="vz-addon-card-footer-section-left">
                      <div class="vz-addon-card-uninstall">
                        <Button.default
                          size={Button.ButtonSizes.ICON}
                          color={Button.ButtonColors.RED}
                          onClick={() => BdApi.showConfirmationModal(
                            `Uninstall ${name}`, 
                            [`Are you sure you wan't to uninstall ${name}`], 
                            {
                              danger: true, 
                              confirmText: "Uninstall", 
                              onConfirm: () => {this.props.onDelete()}
                            }
                          )}
                        >
                          <Icon 
                            name="Trash" 
                            tooltip="Uninstall"
                          />
                        </Button.default>
                      </div>
                    </div>
                    <div class="vz-addon-card-footer-section-right">
                      {(typeof this.props.meta.source === "string") && (
                        <Icon
                          name="GitHub"
                          tooltip="Source"
                          onClick={() => eleShell.openExternal(this.props.meta.source)}
                        />
                      )}
                      {(typeof this.props.meta.invite === "string") && (
                        <Icon
                          name="HelpCircle"
                          tooltip="Support server"
                          onClick={() => {
                            let code = this.props.meta.invite
                            const tester = /\.gg\/(.*)$/
                            if (tester.test(code)) code = code.match(tester)[1]
                            BdApi.findModuleByProps("acceptInvite").acceptInvite(code)
                          }}
                        />
                      )}
                      {(typeof this.props.meta.website === "string") && (
                        <Icon
                          name="Globe"
                          tooltip="Website"
                          onClick={() => eleShell.openExternal(this.props.meta.website)}
                        />
                      )}
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