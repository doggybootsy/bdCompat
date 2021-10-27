import { Icon, Switch } from "@vizality/components"
import { shell as eleShell } from "electron"
import { React, getModule } from "@vizality/webpack"
import SettingsModal from "../PluginSettings.jsx"
const { openModal } = getModule("openModal", "openModalLazy")
const { ModalRoot, ModalSize } = getModule("ModalRoot")

module.exports = class Card extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { sections, meta, plugin, enabled, onChange } = this.props
    const LibraryMissing = `${plugin?.load}`.includes("Library plugin is needed") || `${plugin?.load}`.includes("Library Missing")
    return (
      <div class="vz-addon-card-header-wrapper">
        <sections.Badge />
        <div class="vz-addon-card-content-wrapper">
          <div class="vz-addon-card-content">
            <div class="vz-addon-card-header">
              <div class="vz-addon-card-metadata">
                <div class="vz-addon-card-name-version">
                  <sections.Name />
                  <sections.Version />
                </div>
                <sections.Author />
              </div>
            </div>
            <sections.Description />
            <div class="vz-addon-card-footer-wrapper">
              <div class="vz-addon-card-footer">
                <div class="vz-addon-card-footer-section-left">
                  <sections.UninstallButton />
                </div>
                <div class="vz-addon-card-footer-section-right">
                  {LibraryMissing && (
                    <Icon
                      name="WarningCircle"
                      tooltip="A library is needed for this plugin to properly work"
                    />
                  )}
                  {(typeof meta.source === "string") && (
                    <Icon
                      name="GitHub"
                      tooltip="Source"
                      onClick={() => eleShell.openExternal(meta.source)}
                    />
                  )}
                  {(typeof meta.invite === "string") && (
                    <Icon
                      name="HelpCircle"
                      tooltip="Support server"
                      onClick={() => {
                        let code = meta.invite
                        const tester = /\.gg\/(.*)$/
                        if (tester.test(code)) code = code.match(tester)[1]
                        BdApi.findModuleByProps("acceptInvite").acceptInvite(code)
                      }}
                    />
                  )}
                  {(typeof meta.website === "string") && (
                    <Icon name="Globe" tooltip="Website" onClick={() => eleShell.openExternal(meta.website)} />
                  )}
                  {(typeof plugin.getSettingsPanel === "function" && enabled) && (
                    <Icon
                      className="vz-addon-card-settings-button-icon-wrapper"
                      iconClassName="vz-addon-card-settings-button-icon"
                      name="Gear"
                      tooltip="Settings"
                      onClick={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={plugin} modalProps={props}/></ModalRoot>))}
                    />
                  )}
                  <Switch className="vz-addon-card-toggle" checked={enabled} onChange={onChange}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}