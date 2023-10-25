const fs = require("fs");
const {
  parseHooksTemplate,
  parseImportTemplate,
  parseInstanceTemplate,
  updateExistingFile,
} = require("./utils");

module.exports = class Render {
  generate(
    args = {},
    { hasExistingFile, fileContent, contextData, observerData }
  ) {
    if (hasExistingFile) {
      const content = fileContent.split("\n");
      const updatedContent = updateExistingFile(args, content);
      return updatedContent;
    }
    let result = [parseImportTemplate(args), "\n"];
    let body = args.name.split(",");
    const hasContext = !!args.context;
    const hasObservers = !!args.observer;
    const hasHooks = !!args.hook;
    if (hasContext || hasObservers) {
      body = body.map((name) => parseInstanceTemplate({ ...args, name }));
      result = result.concat(body);
      return result.join("");
    }
    if (hasHooks) {
      const hasContext = fs.existsSync(contextData.path);
      const hasObserver = fs.existsSync(observerData.path);
      const contextName = `Context${contextData.name}`;
      const observerName = `Observer${observerData.name}`;
      body = body.map((name) =>
        parseHooksTemplate({
          ...args,
          name,
          contextName,
          observerName,
          contextFilePath: contextData.path,
          observerFilePath: observerData.path,
          hasObserver,
          hasContext,
        })
      );
      if (hasContext) {
        result = [`import { ${contextData.name} as ${contextName} } from "../contexts/${contextData.name}";`, '\n', ...result];
      } else {
        body = [
          parseInstanceTemplate({ key: "context", name: args.name.replace(/use/ig, '') }),
          ...body
        ]
      }
      if (hasObserver) {
        result = [`import { ${observerData.name} as ${observerName} } from "../observers/${observerData.name}";`, '\n', ...result];
      }
      result = result.concat(body);
      return result.join("");
    }
  }
}
