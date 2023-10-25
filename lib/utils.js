const path = require("path");
const fs = require("fs");

const KeywordsHashMap = {
  context: "Context",
  observer: "Observer",
  hook: "useObserver",
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const mapOptionsToKeywords = (args = {}) => {
  const result = [];
  for (const [key, value] of Object.entries(args)) {
    const keyword = KeywordsHashMap[key];
    if (value && keyword) result.push(keyword);
  }
  return result.length === 0 ? result[0] : result.join(",");
};

const parseImportTemplate = (options = {}) => {
  const fileFolderPath = path.join(__dirname + "/templates/import.txt");
  const data = fs.readFileSync(fileFolderPath, "utf-8");
  const deps = mapOptionsToKeywords(options);
  return data.replace("#1", deps);
};

const parseHooksTemplate = (options = {}) => {
  const { name } = options;
  const fileFolderPath = path.join(__dirname + "/templates/hook.txt");
  const data = fs.readFileSync(fileFolderPath, "utf-8");
  return data
    .replaceAll("#0", name) 
    .replaceAll("#1", options.contextName)
    .replaceAll("#2", options.observerName);
};

const parseInstanceTemplate = ({ name, ...options }) => {
  const fileFolderPath = path.join(__dirname + "/templates/instance.txt");
  const data = fs.readFileSync(fileFolderPath, "utf-8");
  return data
    .replace("#0", mapOptionsToKeywords(options))
    .replaceAll("#1", name);
};

function updateExistingFile({ name, ...options }, content) {
  const names = name.split(",");
  return names
    .reduce(
      (accumulator, name) => {
        accumulator.push(parseInstanceTemplate({ name, ...options }));
        return accumulator;
      },
      [...content]
    )
    .join("\n");
}

exports.mapOptionsToKeywords = mapOptionsToKeywords;
exports.capitalize = capitalize;
exports.parseHooksTemplate = parseHooksTemplate;
exports.parseImportTemplate = parseImportTemplate; 
exports.parseInstanceTemplate = parseInstanceTemplate; 
exports.updateExistingFile = updateExistingFile;
