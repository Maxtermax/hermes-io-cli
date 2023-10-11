#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { capitalize } = require("../utils/utils");
const { renderContent } = require("./templates");

function scanInput() {
  const argv = yargs(hideBin(process.argv)).argv;
  parseInput(argv);
}

/**
 * Parses input arguments and initiates the process of building files based on contexts and observers.
 *
 * @param {Object} args - The input arguments object.
 * @param {Array} args.contexts - An array of context data.
 * @param {Array} args.observers - An array of observer data.
 * @param {string} args["contexts-filename"] - The filename for the contexts file.
 * @param {string} args["observers-filename"] - The filename for the observers file.
 *
 * @example
 * const inputArgs = {
 *   contexts: [{ name: 'ContextA', data: {} }, { name: 'ContextB', data: {} }],
 *   observers: [{ name: 'Observer1', data: {} }, { name: 'Observer2', data: {} }],
 *   "contexts-filename": 'contexts.json',
 *   "observers-filename": 'observers.json',
 * };
 * parseInput(inputArgs);
 */
function parseInput(args) {
  const { contexts, observers, root } = args;
  const options = {
    ["contexts-filename"]: args["contexts-filename"],
    ["observers-filename"]: args["observers-filename"],
    ["root"]: args["root"],
  };
  buildFiles(
    {
      root,
      contexts,
      observers,
    },
    options
  );
}

/**
 * Builds files based on provided contexts and observers, creating JavaScript files in specified directories.
 *
 * @param {Object} [params={}] - An object containing context and observer information.
 * @param {string} params.contexts - The context information as a string.
 * @param {string} params.observers - The observer information as a string.
 * @param {Object} [options={}] - Additional options for file generation.
 * @param {string} [options.contexts-filename] - Custom filename for the contexts file (optional).
 * @param {string} [options.observers-filename] - Custom filename for the observers file (optional).
 * @throws {Error} Throws an error if the provided value for contexts or observers is not a string.
 *
 * @example
 * const params = {
 *   contexts: "ContextData",
 *   observers: "ObserverData"
 * };
 * const options = {
 *   "contexts-filename": "custom-contexts",
 *   "observers-filename": "custom-observers"
 * };
 * buildFiles(params, options);
 *
 * // This will generate two files: custom-contexts.js and custom-observers.js
 */
function buildFiles(params = {}, options = {}) {
  const { contexts, observers, root = '.' } = params;
  for (const [key, value] of Object.entries({ contexts, observers })) {
    if (typeof value !== "string") continue;
    let fileFolderPath = path.join(__dirname + "./../", key);
    if (root) {
      fileFolderPath = `${root}/${key}`;
    }
    const filename = options[`${key}-filename`]
      ? options[`${key}-filename`]
      : key;
    const filePath = path.join(fileFolderPath, filename + ".js");
    if (!fs.existsSync(fileFolderPath)) fs.mkdirSync(fileFolderPath);
    const hasExistingFile = fs.existsSync(filePath);
    const fileContent = hasExistingFile
      ? fs.readFileSync(filePath, "utf-8")
      : "";
    const content = renderContent(
      { name: capitalize(value), [key]: true },
      { hasExistingFile, fileContent }
    );
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

scanInput();
