import AddonManager from "./AddonManager.js"
import { join } from "path"

class PluginManager extends AddonManager {
  get name() { return "PluginManager" }
  get moduleExtension() { return ".js" }
  get extension() { return ".plugin.js" }
  get duplicatePattern() { return /\.plugin\s?\([0-9]+\)\.js/ }
  get addonFolder() { return join(__dirname, "..", "plugins") }
  get prefix() { return "plugin" }
  get language() { return "javascript" }
}

export default { PluginManager: new PluginManager }