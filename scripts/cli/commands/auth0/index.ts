import { getCommandDirOptions } from '../../helpers';

export const command = 'auth0 <command>';
export const desc = 'Work with Auth0';
export const builder = function (yargs) {
  yargs.commandDir('create-user', getCommandDirOptions());
};
export const handler = function () {};
