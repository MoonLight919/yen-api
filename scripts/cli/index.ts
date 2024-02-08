#!/usr/bin/env node
import yargs from 'yargs';
import { getCommandDirOptions } from './helpers';

yargs(process.argv.slice(2))
  .scriptName('yarn yen')
  .usage('$0 <cmd> [args]')
  .commandDir('commands/auth0', getCommandDirOptions())
  .commandDir('commands/user', getCommandDirOptions())
  .demandCommand()
  .showHelpOnFail(false)
  .help().argv;
