#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { capitalize } = require("./utils");
const Render = require("./render");

function scanInput() {
  const argv = yargs(hideBin(process.argv)).argv;
  const { context, observer, hook, root = "." } = argv;
  buildFiles({
    root,
    hook,
    context,
    observer,
  });
}

function buildFilename({ params, key }) {
  const option = params[key];
  if (option) return option;
  return key;
}

function buildFileContent({ hasExistingFile, filePath }) {
  if (hasExistingFile) return fs.readFileSync(filePath, "utf-8");
  return "";
}

function buildDependencieFile({ value, key, root }) {
  if (root) {
    return {
      name: value.replace("use", ""), 
      path: `${root}/${key}/${value.replace("use", "")}.js`
    }
  }
  return {
    name: value.replace("use", ""),
    path: path.join(__dirname, `/${key}/${value.replace("use", "")}.js`)
  }
}

function buildFiles(params = {}) {
  const { context, observer, hook, root = "." } = params;
  for (const [key, value] of Object.entries({ context, observer, hook })) {
    if (typeof value !== "string") continue;
    let fileFolderPath = path.join(__dirname + "./../", `${key}s`);
    if (root) {
      fileFolderPath = `${root}/${key}s`;
    }
    const filename = buildFilename({ params, key });
    const filePath = path.join(fileFolderPath, filename + ".js");
    if (!fs.existsSync(fileFolderPath)) fs.mkdirSync(fileFolderPath, { recursive: true });

    const hasExistingFile = fs.existsSync(filePath);
    const fileContent = buildFileContent({ hasExistingFile, filePath });
    const contextData = buildDependencieFile({
      value,
      root,
      key: "contexts",
    });
    const observerData = buildDependencieFile({
      value,
      root,
      key: "observers",
    });
    const { generate } = new Render();
    const content = generate(
      { name: capitalize(value), [key]: true },
      { hasExistingFile, fileContent, contextData, observerData }
    );
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

scanInput();
