import { readdirSync } from "fs"
import { join } from "path"

readdirSync(__dirname).filter(file => file != "index.js").forEach(
  filename => exports[filename.split(".")[0]] = require(join(__dirname, filename))
)