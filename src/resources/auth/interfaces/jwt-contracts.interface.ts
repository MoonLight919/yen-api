export interface JwtOptions {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
}

export interface JwtHeader {
  alg: string;
  typ: 'JWT';
  kid: string;
}

export interface JwtPayload {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}
