import { type ConfigurationRecord } from '@resources/configuration/interfaces';
import { configurationsRepository } from '../lib/database/repositories';

export const updateConfiguration = async (
  override: Partial<ConfigurationRecord>,
): Promise<ConfigurationRecord> => {
  const record = await configurationsRepository().select('*').limit(1).first();
  return (
    await configurationsRepository()
      .update(override)
      .where({ id: record?.id })
      .returning('*')
  )[0];
};
