import { type UserRecord } from '@resources/user/interfaces';
import { userRepository } from '../lib/database/repositories';

export function selectAllUsers(): Promise<UserRecord> {
  return userRepository().select('*');
}

export function selectUserByPhoneNumber(
  phoneNumber: string,
): Promise<UserRecord> {
  return userRepository()
    .select('*')
    .where('phone_number', phoneNumber)
    .first<UserRecord>();
}

export function selectUserById(id: string): Promise<UserRecord> {
  return userRepository().select('*').where('id', id).first<UserRecord>();
}

export function selectUserBy(
  filters: Partial<UserRecord>,
): Promise<UserRecord> {
  return userRepository().select('*').where(filters).first<UserRecord>();
}
