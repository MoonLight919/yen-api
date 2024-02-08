import { GetUsers200ResponseOneOfInner, UserCreate } from 'auth0';
import { getManagementClient } from '../providers';

export const createAuth0User = async (
  userData: Omit<UserCreate, 'connection'>,
): Promise<GetUsers200ResponseOneOfInner> => {
  const { data } = await getManagementClient().users.create({
    connection: 'yen',
    ...userData,
  });
  return data;
};

export const getAuth0User = async (
  idAuth0: string,
): Promise<GetUsers200ResponseOneOfInner | null> => {
  try {
    const { data } = await getManagementClient().users.get({
      id: idAuth0,
    });
    return data;
  } catch (err) {
    return null;
  }
};
