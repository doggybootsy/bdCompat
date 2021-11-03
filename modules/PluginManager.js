import { join } from "path"
import { Module } from "module"

Module.globalPaths.push(join(process.resourcesPath, "app.asar/node_modules"))

class PluginManager {
  
}

export default PluginManager