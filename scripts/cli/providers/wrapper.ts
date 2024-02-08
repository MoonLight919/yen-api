import { getKnex } from './knex';
import { ArgumentsCamelCase } from 'yargs';

export const wrapper = <T>(
  cb: (argv: ArgumentsCamelCase<T>) => Promise<void>,
): ((argv: ArgumentsCamelCase<T>) => Promise<void>) => {
  return async (argv: ArgumentsCamelCase<T>): Promise<void> => {
    await cb(argv);
    process.exit(0);
  };
};

process.on('exit', async () => {
  await getKnex().destroy();
});
