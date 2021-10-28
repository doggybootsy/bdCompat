import React from "react"
import { Icon, StickyElement } from "@vizality/components"
import { SwitchItem, RadioGroup, FormItem } from "@vizality/components/settings"
import { Flex } from "../constants"

const Layouts = ["compact","cover","card","list"]

module.exports = class BdSettings extends React.Component {
  constructor (props) {
    super(props)
    this.settings = {
      getSetting: this.props.getSetting !== undefined ? this.props.getSetting : this.props.pluginManager.settings.get,
      toggleSetting: this.props.toggleSetting !== undefined ? this.props.toggleSetting : this.props.pluginManager.settings.toggle
    }
    this.state = {
      SettingsModal: this.settings.getSetting("SettingsModal", false),
      cardLayout: vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
    }
  }

  render () {
    let layoutOptions = []
    for (const layout of Layouts) {
      layoutOptions.push({
        value: layout,
        name: `${layout[0].toUpperCase()}${layout.substring(1)}`
      })
    }
    return (
      <>
        <div className="vz-sticky-element-wrapper vz-addons-list-sticky-bar-wrapper" style={{top: "40px", marginBottom: "10px"}}>
          <StickyElement className="vz-sticky-element vz-addons-list-sticky-bar">
            <Flex>
              <Flex />
              <div className="vz-addons-list-more-button vz-addons-list-search-options-button">
                <Icon 
                  name="Gear" 
                  onClick={this.props.changePage}
                  tooltip="View plugins"
                  size="25px"
                />
              </div>
            </Flex>
          </StickyElement>
        </div>
        <SwitchItem 
          info="Not a instant change!"
          children="Setting's Modal"
          description="Have this page in a modal"
          value={this.state.SettingsModal}
          onChange={() => {
            this.setState({ SettingsModal: !this.state.SettingsModal })
            this.settings.toggleSetting("SettingsModal", false)
          }}
        />
        <FormItem title="Card layout" note="Changes vizality's card layout too" className={"BD-FormItem"}>
          <RadioGroup options={layoutOptions} value={this.state.cardLayout} onChange={({value}) => {
            vizality.api.settings._fluxProps("addon-manager").updateSetting("listDisplay", value)
            this.setState({ cardLayout: value })}
          }/>
        </FormItem>
        <div></div>
      </>
    )
  }
}