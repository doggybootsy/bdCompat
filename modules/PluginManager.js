import { readdir, existsSync, readFileSync, mkdirSync, unlinkSync, watch } from "fs"
import { join } from "path"
import BdApi from "./BdApi"

const Addons = new class {
  constructor() {
    this.addons = {"plugins": [], "paths": {}}
    this.loadAddons()
  }
  get settings() { return vizality.manager.plugins.get("bd-compat").settings }
  get pluginDir() { return join(__dirname, "..", "plugins") }

  setEnable(plugin, val) {
    let enabledPlugins = this.settings.get("enabledPlugins", {})
    enabledPlugins[plugin] = val
    this.settings.set("enabledPlugins", enabledPlugins)
  }
  getIsEnabled(plugin) { return this.settings.get("enabledPlugins", {})[plugin] }

  deletePlugin(plugin) {
    if (this.getIsEnabled(plugin.id) && plugin.exports.stop) plugin.exports.stop()
    this.setEnable(plugin.id, false)
    unlinkSync(this.addons.paths[plugin.id])
    BdApi.showToast(`Deleted ${plugin.id}`, {type: "success"})
    this.loadAddons()
  }
  // Meta
  extractMeta(content) {
    const firstLine = content.split("\n")[0]
    if (firstLine.includes("//META")) return this.parseOldMeta(content)
    if (firstLine.includes("/**")) return this.parseNewMeta(content)
    throw new Error("META was not found.")
  }
  parseOldMeta(content) {
    const metaLine = content.split("\n")[0]
    const rawMeta = metaLine.substring(metaLine.lastIndexOf("//META") + 6, metaLine.lastIndexOf("*//"))
    if (metaLine.indexOf("META") < 0) throw new Error("META was not found.")
    if (!window.BdApi.testJSON(rawMeta)) throw new Error("META could not be parsed")
    const parsed = JSON.parse(rawMeta)
    if (!parsed.name) throw new Error("META missing name data")
    parsed.format = "json"
    return parsed
  }
  parseNewMeta(content) {
    const block = content.split("/**", 2)[1].split("*/", 1)[0]
    const out = {}
    let field = "", accum = ""
    for (const line of block.split(/[^\S\r\n]*?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/)) {
      if (line.length === 0) continue
      if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
        out[field] = accum
        const l = line.indexOf(" ")
        field = line.substr(1, l - 1)
        accum = line.substr(l + 1)
      } 
      else accum += " " + line.replace("\\n", "\n").replace(/^\\@/, "@")
    }
    out[field] = accum.trim()
    delete out[""]
    out.format = "jsdoc"
    return out
  }
  // Addon
  loadAddons() {
    try {
      if (!existsSync(this.pluginDir)) mkdirSync(this.pluginDir)
      readdir(this.pluginDir, (errRD, files) => {
        if (errRD) throw errRD
        for (const file of files) {
          if (file.endsWith(".plugin.js")) {
            const path = join(__dirname, "..", "plugins", file)
            const content = readFileSync(path, "utf8")
            const meta = this.extractMeta(content)
            const exports = require(path)
            meta["exports"] = new exports()
            // Add missing info/add the get<Thing>
            if (meta.exports.getName) meta["name"] = meta.exports.getName()
            if (meta["name"] === undefined || meta["name"] === "undefined") meta["name"] = file.replace(".plugin.js", "")
            if (meta.exports.getVersion) meta["version"] = meta.exports.getVersion()
            if (meta["version"] === undefined || meta["version"] === "undefined") meta["name"] = "???"
            if (meta.exports.getAuthor) meta["author"] = meta.exports.getAuthor()
            if (meta["author"] === undefined || meta["author"] === "undefined") meta["author"] = "???"
            if (meta.exports.getDescription) meta["description"] = meta.exports.getDescription()
            if (meta["description"] === undefined || meta["description"] === "undefined") meta["description"] = ""
            if (!meta["id"]) meta["id"] = meta.name
            if (this.getIsEnabled(meta.id) === undefined) this.setEnable(meta.id, false)
            this.addons.plugins.push(meta)
            this.addons.paths[meta.id] = path
            if (meta.exports.load) meta.exports.load()
          }
        }
      })
    } 
    catch (error) {
      console.log(error);
    }
  }
}

export default new class {
  get folder() { return Addons.pluginDir }
  isEnabled(idOrAddon) { 
    let data = Addons.getIsEnabled(idOrAddon)
    if (data === undefined) data = false
    return data
  }
  enable(idOrAddon) {
    const plugin = this.get(idOrAddon)
    if (plugin.exports.start) plugin.exports.start()
    BdApi.showToast(`Enabled ${plugin.name} v${plugin.version} by ${plugin.author}.`, { type: "success" })
    return Addons.setEnable(idOrAddon, true)
  }
  disable(idOrAddon) { 
    const plugin = this.get(idOrAddon)
    if (plugin.exports.stop) plugin.exports.stop()
    BdApi.showToast(`Disabled ${plugin.name} v${plugin.version} by ${plugin.author}.`, { type: "success" })
    return Addons.setEnable(idOrAddon, false)
  }
  toggle(idOrAddon) { return this.isEnabled(idOrAddon) ? this.disable(idOrAddon) : this.enable(idOrAddon) }
  reload(idOrFileOrAddon) { return this.disable(idOrFileOrAddon), this.enable(idOrFileOrAddon) }
  get(idOrFile) { return Addons.addons.plugins.filter(m => m.id === idOrFile)[0] }
  getAll(paths) { return paths ? {
    paths: Addons.addons.paths,
    addonsApi: Addons
  } : Addons.addons.plugins }
}