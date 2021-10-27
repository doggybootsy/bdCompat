import { React } from "@vizality/webpack"
import PluginList from "./PluginList.jsx"

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <PluginList pluginManager={window.pluginModule} />
    )
  }
}