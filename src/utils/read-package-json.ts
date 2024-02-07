import { readFileSync } from 'fs';
import { resolve } from 'path';

export const readPackageJson = (): {
  name: string;
  version: string;
  private: boolean;
  license: string;
  author: string;
  repository: string;
  engines: {
    node: string;
  };
  packageManager: string;
  [key: string]: unknown;
} => {
  const packageJson = readFileSync(resolve('package.json'), {
    encoding: 'utf8',
  });
  return JSON.parse(packageJson);
};
