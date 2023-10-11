const fs = require("fs");
const path = require("path");
const { mapOptionsToKeywords } = require("../utils/utils");

const parseImportTemplate = (options = {}) => {
  const fileFolderPath = path.join(__dirname + "/templates/import.txt");
  const data = fs.readFileSync(fileFolderPath, "utf-8");
  const deps = mapOptionsToKeywords(options);
  return data.replace("#1", deps);
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

/*
const result = updateExistingFile(
  {
    name: "Text1",
    contexts: true,
  },
  `
const Test = new Context('Test1')
console.log(Test);
`.split("\n")
);
console.log(result);
*/

const renderContent = (args = {}, { hasExistingFile, fileContent }) => {
  if (hasExistingFile) {
    const content = fileContent.split("\n");
    const updatedContent = updateExistingFile(args, content);
    console.log('updatedContent: ', updatedContent);
    return updatedContent;
  }
  let result = [];
  result.push(parseImportTemplate(args));
  result.push("\n");
  const body = args.name
    .split(",")
    .map((name) => parseInstanceTemplate({ ...args, name }));
  result = result.concat(body);
  return result.join("");
};

exports.renderContent = renderContent;
