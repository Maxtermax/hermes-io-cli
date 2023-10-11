const tokensHash = {
  contexts: "Context",
  observers: "Observer",
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const mapOptionsToKeywords = (args = {}) => {
  const result = [];
  for (const [key, value] of Object.entries(args)) {
    const keyword = tokensHash[key];
    if (value && keyword) result.push(keyword);
  }
  return result.length === 0 ? result[0] : result.join(",");
};

exports.mapOptionsToKeywords = mapOptionsToKeywords;
exports.capitalize = capitalize;
