// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const blacklist = require("metro-config/src/defaults/exclusionList");

defaultConfig.resolver = {
  blacklistRE: blacklist([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
};

module.exports = defaultConfig;
