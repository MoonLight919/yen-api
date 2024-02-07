import * as jwt from 'jsonwebtoken';

export const getMockJwt = async (
  id: string,
  payload: Record<string, unknown> = {},
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        sub: id,
        iss: 'https://api.moji-mock.com',
        aud: [],
        iat: Date.now(),
        exp: Date.now(),
        azp: '',
        scope: '',
        ...payload,
      },
      'mock-secret',
      (err: Error | null, token?: string) => {
        if (err) {
          return reject(err);
        }
        return resolve(token || '');
      },
    );
  });
};
