import React from "react"
import PluginList from "./PluginList.jsx"
import BdSettings from "./BdSettings.jsx"

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = { PluginList: true }
    this.changePage = () => this.setState({ PluginList: !this.state.PluginList })
  }

  render () {
    return (
      <>
        {this.state.PluginList ? <PluginList pluginManager={window.pluginModule} changePage={this.changePage} /> : <BdSettings changePage={this.changePage} {...this.props}/> }
      </>
    )
  }
}