import { readPackageJson } from './read-package-json';

export const verifyNodeJSVersion = async (): Promise<void> => {
  const packageJson = await readPackageJson();

  const [expectMajorVersion, expectMinorVersion, expectPatchVersion] =
    packageJson.engines.node.split('.');
  const [currentMajorVersion, currentMinorVersion, currentPatchVersion] =
    process.versions.node.split('.');

  if (
    currentMajorVersion < expectMajorVersion ||
    currentMinorVersion < expectMinorVersion ||
    currentPatchVersion < expectPatchVersion
  ) {
    throw new Error(
      `The current version "${process.versions.node}" of your nodejs is not satisfied. The required version for running application is "${packageJson.engines.node}" or newer. Please update update you node or use "nvm" for switching nodejs versions`,
    );
  }
};
