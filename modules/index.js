import { readdirSync } from "fs"
import { join } from "path"

for (const filename of readdirSync(__dirname).filter(file => file != "index.js")) {
  const file = require(join(__dirname, filename))
  if (file.default === undefined) exports[filename.split(".")[0]] = file
  else module.exports[filename.split(".")[0]] = file.default 
}