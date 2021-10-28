import React from "react"
import { resolve } from "path"

import { ModalRoot, Messages, Button, Header, Flex, Text } from "../constants"

const { ModalHeader, ModalContent, ModalCloseButton, ModalFooter } = ModalRoot

module.exports = class PluginSettings extends React.Component {
  renderPluginSettings() {
    let panel
    try {
      panel = this.props.plugin.getSettingsPanel()
    } catch (e) {
      console.error(e)
      const error = (e.stack || e.toString()).split("\n").filter(l => !l.includes("discordapp.com/assets/") && !l.includes("discord.com/assets/")).join("\n").split(resolve(__dirname, "..", "..")).join("")
      return (
        <div className="vizality-text vizality-settings-error">
          <div>An error occurred while rendering settings panel.</div>
          <code>{error}</code>
        </div>
      )
    }
    if (panel instanceof Node || typeof panel === "string")
      return <div ref={el => el ? panel instanceof Node ? el.append(panel) : el.innerHTML = panel : void 0}></div>
    return typeof panel === "function" ? React.createElement(panel) : panel
  }

  render () {
    const name = (this.props.plugin.getName() || this.props.meta.name) ?? "No author"
    const version = (this.props.plugin.getVersion() || this.props.meta.version) ?? "No version"
    try {
      return (
        <>
          <ModalHeader separator={false}>
            <Flex>
              <Flex.Child>
                <Header tag="h2">{name} Settings</Header>
                <Text>{version}</Text>
              </Flex.Child>
            </Flex>
          </ModalHeader>
          <ModalContent>
            <div className="plugin-settings" id={`plugin-settings-${name}`}>
              {this.renderPluginSettings()}
            </div>
          </ModalContent>
          <ModalFooter>
            <Button.default onClick={this.props.modalProps.onClose}>{Messages.DONE}</Button.default>
          </ModalFooter>
        </>
      )
    } 
    catch (error) {
      return <ModalHeader separator={false}><FormTitle tag={FormTitle.Tags.H4}>Error</FormTitle><ModalCloseButton onClick={() => this.props.modalProps.onClose()}/></ModalHeader>
    }
  }
}