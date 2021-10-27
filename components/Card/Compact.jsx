import { Icon, Switch } from "@vizality/components"
import { getModule, React } from "@vizality/webpack"
import SettingsModal from "../PluginSettings.jsx"

const { openModal } = getModule("openModal", "openModalLazy")
const { ModalRoot, ModalSize } = getModule("ModalRoot")

module.exports = class Compact extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { sections, plugin, enabled, onChange } = this.props
    const LibraryMissing = `${plugin.load}`.includes("Library plugin is needed") || `${plugin.load}`.includes("Library Missing")
    return (
      <div className="vz-addon-card-header-wrapper">
        <div className="vz-addon-card-content-wrapper">
          <div className="vz-addon-card-content">
            <div className="vz-addon-card-header">
              <sections.Badge />
              <div className="vz-addon-card-metadata">
                <div className="vz-addon-card-name-version">
                  <sections.Name />
                </div>
                <sections.Author />
              </div>
              <div className="vz-addon-card-actions">
                {LibraryMissing && (
                  <Icon
                    name="WarningCircle"
                    tooltip="A library is needed for this plugin to properly work"
                  />
                )}
                {(typeof plugin.getSettingsPanel === "function" && enabled) && (
                  <div className="vz-addon-card-settings">
                    <Icon
                      className="vz-addon-card-settings-button-wrapper"
                      iconClassName="vz-addon-card-settings-button"
                      name="Gear"
                      tooltip="Settings"
                      onClick={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={plugin} modalProps={props}/></ModalRoot>))}
                    />
                  </div>
                )}
                <div className="vz-addon-card-toggle-wrapper">
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