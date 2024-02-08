import { RequireDirectoryOptions } from 'yargs';

export const getCommandDirOptions = (
  options: RequireDirectoryOptions = {},
): RequireDirectoryOptions => ({
  extensions: ['ts'],
  ...options,
});
