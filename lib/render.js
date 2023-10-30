const fs = require("fs");
const {
  parseHooksTemplate,
  parseImportTemplate,
  parseInstanceTemplate,
} = require("./utils");

module.exports = class Render {
  generate = (args = {}, { contextData, observerData }) => {
    const hasContextFile = fs.existsSync(contextData.path);
    const hasObserverFile = fs.existsSync(observerData.path);
    const isProcessingContext = !!args.context;
    const isProcessingObservers = !!args.observer;
    const isProcessingHook = !!args.hook;
    let result = [];
    let body = args.name.split(",");
    if (isProcessingContext || isProcessingObservers) {
      result = [parseImportTemplate(args), "\n"];
      body = body.map((name) => parseInstanceTemplate({ ...args, name }));
      result = result.concat(body);
      return result.join("");
    }
    if (isProcessingHook) {
      const contextName = `Context${contextData.name}`;
      const observerName = `Observer${observerData.name}`;
      const imports = { hook: true };
      body = [
        "\n",
        ...body.map((name) =>
          parseHooksTemplate({
            ...args,
            name,
            contextName,
            observerName,
            contextFilePath: contextData.path,
            observerFilePath: observerData.path,
            hasObserver: hasObserverFile,
            hasContext: hasContextFile,
          })
        ),
      ];
      if (hasContextFile) {
        result = this.linkExistingContext(result, contextData, contextName);
      } else {
        imports.context = true;
        body = this.generateLocalContextInstance(body, contextName);
      }
      if (hasObserverFile) {
        result = this.linkExistingObserver(result, observerData, observerName);
      } else {
        imports.observer = true;
        body = this.generateLocalObserverInstance(body, observerName);
      }
      result = [parseImportTemplate(imports), ...result];
      result = result.concat(body);
      return result.join("");
    }
  };

  generateLocalObserverInstance(body, observerName) {
    body = [
      "\n",
      parseInstanceTemplate({
        observer: true,
        name: observerName,
      }),
      ...body,
    ];
    return body;
  }

  generateLocalContextInstance(body, contextName) {
    body = [
      "\n",
      parseInstanceTemplate({
        context: true,
        name: contextName,
      }),
      ...body,
    ];
    return body;
  }

  linkExistingObserver(result, observerData, observerName) {
    result = [
      `import { ${observerData.name} as ${observerName} } from "../observers/${observerData.name}";`,
      "\n",
      ...result,
    ];
    return result;
  }

  linkExistingContext(result, contextData, contextName) {
    result = [
      `import { ${contextData.name} as ${contextName} } from "../contexts/${contextData.name}";`,
      "\n",
      ...result,
    ];
    return result;
  }
};
