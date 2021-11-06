import { readdir, readFile } from "fs"
import { join } from "path"
import Logger from "./Logger"

export default class AddonManager {

  get name() {return ""}
  get moduleExtension() {return ""}
  get extension() {return ""}
  get duplicatePattern() {return /./}
  get addonFolder() {return ""}
  get language() {return ""}
  get prefix() {return "addon"}
  
  emit(event, ...args) {
    
  }

  loadAllAddons() {
    readdir(this.addonFolder, (err, files) => {
      if (err) {
        Logger.error(err)
        return BdApi.alert("BdCompat:BetterDiscord", [`Failed to read ${this.addonFolder}`, "Read console for more info"])
      }
      else {
        for (const file of files) {
          if (!file.endsWith(this.extension)) continue
          readFile(join(this.addonFolder, file), "utf8", (err, content) => {
            if (err) {
              Logger.error(err)
              return BdApi.alert("BdCompat:BetterDiscord", [`Failed to read ${file}`, "Read console for more info"])
            }
            else {
              const meta = this.extractMeta(content)
              if (!meta) {
                Logger.error(`Failed to parse ${file}`)
                return BdApi.alert("BdCompat:BetterDiscord", `Failed to parse ${file}`)
              }
              else {
                
              }
            }
          })
        }
      }
    })
  }
  constructor() {
    this.timeCache = {}
    this.addonList = []
    this.state = {}
    this.windows = new Set()
    this.loadAllAddons()
  }
  extractMeta(fileContent) {
    const firstLine = fileContent.split("\n")[0]
    const hasOldMeta = firstLine.includes("//META")
    if (hasOldMeta) return this.parseOldMeta(fileContent)
    const hasNewMeta = firstLine.includes("/**")
    if (hasNewMeta) return this.parseNewMeta(fileContent)
  }
  parseOldMeta(fileContent) {
    const meta = fileContent.split("\n")[0]
    const metaData = meta.substring(meta.lastIndexOf("//META") + 6, meta.lastIndexOf("*//"))
    const parsed = BdApi.testJSON(metaData)
    parsed.format = "json"
    return parsed
  }

  parseNewMeta(fileContent) {
    const block = fileContent.split("/**", 2)[1].split("*/", 1)[0]
    const out = {}
    let field = ""
    let accum = ""
    for (const line of block.split(/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/)) {
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
  getAddon(idOrFile) {
    
  }

  enableAddon(idOrAddon) {
    
  }

  disableAddon(idOrAddon) {
    
  }
}