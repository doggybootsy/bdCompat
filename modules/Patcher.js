/**
 * yoinked from {@link https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/patcher.js} and edited
 */

import Logger from "./Logger"
import DiscordModules from "./DiscordModules"
import { getModule } from "@vizality/webpack"

export default class Patcher {
  static get patches() {return this._patches || (this._patches = [])}
  static getPatchesByCaller(name) {
    if (!name) return []
    const patches = []
    for (const patch of this.patches) {
      for (const childPatch of patch.children) {
        if (childPatch.caller === name) patches.push(childPatch)
      }
    }
    return patches
  }
  static unpatchAll(patches) {
    if (typeof patches === "string") patches = this.getPatchesByCaller(patches)
    for (const patch of patches) patch.unpatch()
  }
  static resolveModule(module) {
    if (!module || typeof(module) === "function" || (typeof(module) === "object" && !Array.isArray(module))) return module
    if (typeof module === "string") return DiscordModules[module]
    if (Array.isArray(module)) return getModule(module)
    return null
  }
  static makeOverride(patch) {
    return function () {
      let returnValue
      if (!patch.children || !patch.children.length) return patch.originalFunction.apply(this, arguments)
      for (const superPatch of patch.children.filter(c => c.type === "before")) {
        try {
          superPatch.callback(this, arguments)
        }
        catch (err) {
          Logger.err("Patcher", `Could not fire before callback of ${patch.functionName} for ${superPatch.caller}`, err)
        }
      }
      const insteads = patch.children.filter(c => c.type === "instead")
      if (!insteads.length) {returnValue = patch.originalFunction.apply(this, arguments)}
      else {
        for (const insteadPatch of insteads) {
          try {
            const tempReturn = insteadPatch.callback(this, arguments, patch.originalFunction.bind(this))
            if (typeof(tempReturn) !== "undefined") returnValue = tempReturn
          }
          catch (err) {
            Logger.err("Patcher", `Could not fire instead callback of ${patch.functionName} for ${insteadPatch.caller}`, err)
          }
        }
      }
      for (const slavePatch of patch.children.filter(c => c.type === "after")) {
        try {
          const tempReturn = slavePatch.callback(this, arguments, returnValue)
          if (typeof(tempReturn) !== "undefined") returnValue = tempReturn
        }
        catch (err) {
          Logger.err("Patcher", `Could not fire after callback of ${patch.functionName} for ${slavePatch.caller}`, err)
        }
      }
      return returnValue
    }
  }
  static rePatch(patch) {
    patch.proxyFunction = patch.module[patch.functionName] = this.makeOverride(patch)
  }
  static makePatch(module, functionName, name) {
    const patch = {
      name,
      module,
      functionName,
      originalFunction: module[functionName],
      proxyFunction: null,
      revert: () => { // Calling revert will destroy any patches added to the same module after this
        patch.module[patch.functionName] = patch.originalFunction
        patch.proxyFunction = null
        patch.children = []
      },
      counter: 0,
      children: []
    }
    patch.proxyFunction = module[functionName] = this.makeOverride(patch)
    Object.assign(module[functionName], patch.originalFunction)
    module[functionName].__originalFunction = patch.originalFunction
    module[functionName].toString = () => patch.originalFunction.toString()
    this.patches.push(patch)
    return patch
  }
  static before(caller, moduleToPatch, functionName, callback, options = {}) {return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "before"}))}
  static after(caller, moduleToPatch, functionName, callback, options = {}) {return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "after"}))}
  static instead(caller, moduleToPatch, functionName, callback, options = {}) {return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "instead"}))}
  static pushChildPatch(caller, moduleToPatch, functionName, callback, options = {}) {
    const {type = "after", forcePatch = true} = options
    const module = this.resolveModule(moduleToPatch)
    if (!module) return null
    if (!module[functionName] && forcePatch) module[functionName] = function() {}
    if (!(module[functionName] instanceof Function)) return null
    if (typeof moduleToPatch === "string") options.displayName = moduleToPatch
    const displayName = options.displayName || module.displayName || module.name || module.constructor.displayName || module.constructor.name
    const patchId = `${displayName}.${functionName}`
    const patch = this.patches.find(p => p.module == module && p.functionName == functionName) || this.makePatch(module, functionName, patchId)
    if (!patch.proxyFunction) this.rePatch(patch)
    const child = {
      caller,
      type,
      id: patch.counter,
      callback,
      unpatch: () => {
        patch.children.splice(patch.children.findIndex(cpatch => cpatch.id === child.id && cpatch.type === type), 1)
        if (patch.children.length <= 0) {
          const patchNum = this.patches.findIndex(p => p.module == module && p.functionName == functionName)
          if (patchNum < 0) return
          this.patches[patchNum].revert()
          this.patches.splice(patchNum, 1)
        }
      }
    }
    patch.children.push(child)
    patch.counter++
    return child.unpatch
  }
}