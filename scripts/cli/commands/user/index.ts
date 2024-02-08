import { getCommandDirOptions } from '../../helpers';

export const command = 'user <command>';
export const desc = 'User';
export const builder = function (yargs) {
  yargs.commandDir('create', getCommandDirOptions());
};
export const handler = function () {};
