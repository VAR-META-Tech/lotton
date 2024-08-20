export type TokensType = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // in milliseconds
};

export type JwtPayloadType = {
  session: string;
  iat: number;
  exp: number;
};
