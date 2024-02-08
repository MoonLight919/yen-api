import { UserRecord } from '../../../src/app/user/interfaces';
import { getKnex } from '../providers';

export const userRepository = getKnex<UserRecord, UserRecord>()('users');
