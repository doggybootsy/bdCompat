import { readdirSync } from "fs"
import { join } from "path"

for (const filename of readdirSync(__dirname).filter(file => file != "index.js"))
  exports[filename.split(".")[0]] = require(join(__dirname, filename))