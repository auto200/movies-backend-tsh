// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['!local'],
  versionGroups: [
    {
      // https://github.com/TypeStrong/ts-node/issues/2076
      label: 'Typescript > 5.2 does not work with ts-node yet',
      packages: ['**'],
      dependencies: ['typescript'],
      pinVersion: '5.2.2',
    },
  ],
};

module.exports = config;
