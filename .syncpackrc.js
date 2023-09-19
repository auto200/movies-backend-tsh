// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['!local'],
  versionGroups: [
    {
      label: 'Types for specific node version that project uses',
      packages: ['**'],
      dependencies: ['@types/node'],
      pinVersion: '18.11.9',
    },
  ],
};

module.exports = config;
