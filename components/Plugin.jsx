import React, { memo } from "react"
import { contextMenu } from "@vizality/webpack"
import { Icon, Switch, Anchor, OverflowTooltip, LazyImage } from "@vizality/components"
import Cards from "./Card"
import ContextMenu from "./ContextMenu"
import { Button } from "../constants"

module.exports = class Plugin extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.installed ? this.props.meta.__started : false})
  }
  render() {
    const name = (this.props.plugin.getName() || this.props.meta.name) ?? "No author"
    const version = (this.props.plugin.getVersion() || this.props.meta.version) ?? "No version"
    const author = (this.props.plugin.getAuthor() || this.props.meta.author) ?? "No author"
    const description = (this.props.plugin.getDescription() || this.props.meta.description) ?? "No description"
    const icon = (this.props.meta.vzIcon) ?? `vizality://assets/images/default-plugin-${this.props.ranNum}.png?width=0&height=0`
    const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
    const Card = Cards[`${display[0].toUpperCase()}${display.substring(1)}`]

    const CardOnChange = () => {
      this.setState({enabled: !this.state.enabled})
      this.togglePlugin()
    }

    const handleContextMenu = evt => {
      return contextMenu.openContextMenu(evt, () =>
        <ContextMenu 
          enabled={this.state.enabled} 
          {...this.props}
          onChange={CardOnChange} 
        />
      )
    }
    const uninstall = () => BdApi.showConfirmationModal(
      `Uninstall ${name}`, 
      [`Are you sure you wan't to uninstall ${name}`], 
      {
        danger: true, 
        confirmText: "Uninstall", 
        onConfirm: this.props.onDelete
      }
    )
    const sections = {
      UninstallButton: memo(() => (
        <div class="vz-addon-card-uninstall">
          <Button.default
            size={Button.ButtonSizes.ICON}
            color={Button.ButtonColors.RED}
            onClick={uninstall}
          >
            <Icon name="Trash" tooltip="Uninstall" />
          </Button.default>
        </div>
      )),
      Badge: memo(() => (
        <div className="vz-addon-card-icon">
          <LazyImage
            className="vz-addon-card-icon-image-wrapper"
            imageClassName="vz-addon-card-icon-img"
            src={icon}
          />
        </div>
      )),
      Name: memo(() => (
        <OverflowTooltip className="vz-addon-card-name" text={name}>{name}</OverflowTooltip>
      )),
      Version: memo(() => (
        <span class="vz-addon-card-version">{version}</span>
      )),
      Description: memo(() => (
        <div class="vz-addon-card-description">{description}</div>
      )),
      Author: memo(() => (
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
      )),
      Switch: memo(() => (
        <Switch className="vz-addon-card-toggle" checked={this.state.enabled} onChange={CardOnChange}/>
      ))
    }
    return (
      <div class="vz-addon-card bd-addon-card" vz-addon-type="plugin" onContextMenu={handleContextMenu}>
        <Card 
          enabled={this.state.enabled}
          sections={sections}
          {...this.props}
          onChange={CardOnChange}
        />
      </div>
    )
  }

  togglePlugin () {
    if (this.state.enabled) this.props.onDisable()
    else this.props.onEnable()

    this.forceUpdate()
  }
}