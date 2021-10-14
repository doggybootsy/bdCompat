import { Icon, Switch, Anchor, OverflowTooltip, LazyImage } from "@vizality/components"
import { shell as eleShell } from "electron"
import { React, getModule } from "@vizality/webpack"
import SettingsModal from "../PluginSettings.jsx"
const { openModal } = getModule("openModal")
const { ModalRoot, ModalSize } = getModule("ModalRoot")
const Button = getModule("ButtonLooks")

module.exports = class Card extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const name = (this.props.plugin.getName() || this.props.meta.name) ?? "No author"
    const version = (this.props.plugin.getVersion() || this.props.meta.version) ?? "No version"
    const author = (this.props.plugin.getAuthor() || this.props.meta.author) ?? "No author"
    const description = (this.props.plugin.getDescription() || this.props.meta.description) ?? "No description"
    const LibraryMissing = `${this.props.plugin?.load}`.includes("Library plugin is needed") || `${this.props.plugin?.load}`.includes("Library Missing")
    const icon = (this.props.meta.vzIcon) ?? `vizality://assets/images/default-plugin-${this.props.ranNum}.png?width=0&height=0`
    return (
      <div class="vz-addon-card-header-wrapper">
        <div className="vz-addon-card-icon">
          <LazyImage
            className="vz-addon-card-icon-image-wrapper"
            imageClassName="vz-addon-card-icon-img"
            src={icon}
          />
        </div>
        <div class="vz-addon-card-content-wrapper">
          <div class="vz-addon-card-content">
            <div class="vz-addon-card-header">
              <div class="vz-addon-card-metadata">
                <div class="vz-addon-card-name-version">
                <OverflowTooltip className="vz-addon-card-author-wrapper" text={name}>{name}</OverflowTooltip>
                <span class="vz-addon-card-version">{version}</span>
              </div>
              <OverflowTooltip className="vz-addon-card-author-wrapper" text={author}>
                {(this.props.meta.authorLink == undefined) ? (
                  <Anchor 
                    type="user" 
                    userId={this.props.meta?.authorId} 
                    className="vz-addon-card-author">{author}</Anchor>
                ) : (
                <Anchor 
                    style={{pointerEvents: "all"}}
                    className="vz-addon-card-author"
                    href={this.props.meta.authorLink}>{author}</Anchor>
                )}
              </OverflowTooltip>
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
                          onConfirm: this.props.onDelete
                        }
                      )}
                    >
                      <Icon 
                        name="Trash" 
                        tooltip="Uninstall" />
                    </Button.default>
                  </div>
                </div>
                <div class="vz-addon-card-footer-section-right">
                  {LibraryMissing && (
                    <Icon
                      name="WarningCircle"
                      tooltip="A library is needed for this plugin to properly work"
                    />
                  )}
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
                    <Icon name="Globe" tooltip="Website" onClick={() => eleShell.openExternal(this.props.meta.website)} />
                  )}
                  {(typeof this.props.plugin.getSettingsPanel === "function" && this.props.enabled) && (
                    <Icon
                      className="vz-addon-card-settings-button-icon-wrapper"
                      iconClassName="vz-addon-card-settings-button-icon"
                      name="Gear"
                      tooltip="Settings"
                      onClick={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={this.props.plugin} modalProps={props}/></ModalRoot>))}
                    />
                  )}
                  <Switch checked={this.props.enabled} onChange={this.props.onChange}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}