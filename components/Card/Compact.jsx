import { Icon, Switch, Anchor, OverflowTooltip, LazyImage } from "@vizality/components"
import { getModule } from "@vizality/webpack"
import SettingsModal from "../PluginSettings.jsx"
import React from "react";

const { openModal } = getModule("openModal")
const { ModalRoot, ModalSize } = getModule("ModalRoot")

module.exports = class Compact extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const name = (this.props.plugin.getName() || this.props.meta.name) ?? "No author"
    const author = (this.props.plugin.getAuthor() || this.props.meta.author) ?? "No author"
    const LibraryMissing = `${this.props.plugin.load}`.includes("Library plugin is needed") || `${this.props.plugin.load}`.includes("Library Missing")
    return (
      <>
        <div class="vz-addon-card" vz-addon-id="bd-compat" vz-addon-type="plugin">
          <div className="vz-addon-card-header-wrapper">
            <div className="vz-addon-card-content-wrapper">
              <div className="vz-addon-card-content">
                <div className="vz-addon-card-header">
                  <div className="vz-addon-card-icon">
                    <LazyImage
                      className="vz-addon-card-icon-image-wrapper"
                      imageClassName="vz-addon-card-icon-img"
                      src="vizality://assets/images/default-plugin-1.png?width=0&height=0"
                    />
                  </div>
                  <div className="vz-addon-card-metadata">
                    <div className="vz-addon-card-name-version">
                      <OverflowTooltip className="vz-addon-card-name" text={name}>{name}</OverflowTooltip>
                    </div>
                    <OverflowTooltip className="vz-addon-card-author-wrapper" text={author}>
                      <Anchor
                        type="user"
                        userId={this.props.meta?.authorId}
                        className="vz-addon-card-author"
                      >{author}</Anchor>
                    </OverflowTooltip>
                  </div>
                  <div className="vz-addon-card-actions">
                    {LibraryMissing && (
                      <Icon
                        name="WarningCircle"
                        tooltip="A library is needed for this plugin to properly work"
                      />
                    )}
                    {(typeof this.props.plugin.getSettingsPanel === "function" && this.props.enabled) && (
                      <div className="vz-addon-card-settings">
                        <Icon
                          className="vz-addon-card-settings-button-wrapper"
                          iconClassName="vz-addon-card-settings-button"
                          name="Gear"
                          tooltip="Settings"
                          onClick={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={this.props.plugin} modalProps={props}/></ModalRoot>))}
                        />
                      </div>
                    )}
                    <div className="vz-addon-card-toggle-wrapper">
                      <Switch className="vz-addon-card-toggle" checked={this.props.enabled} onChange={this.props.onChange}/>
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
}