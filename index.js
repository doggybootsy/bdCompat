import { Plugin } from "@vizality/entities"
import { BdApi, Dom, PluginManager } from "./modules"
const oldRequire = window.require
export default class BDCompat extends Plugin {
  start () {
    window.BdApi = BdApi
    window.require = function(path) {
      if ( path === "betterdiscord/bdapi" ) return window.BdApi
      try { return oldRequire(path) } catch (error) { return undefined }
    }
    Dom.initialize()
    this.injectStyles("./styles/index.scss")
  }

  stop () {
    window.require = oldRequire
  }
}