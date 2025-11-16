export interface TokenPayload {
  userId: number;
  email: string;
  roles: string[];
  stateId: number | null;
  municipalityId: number | null;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
}

export interface ITokenGenerator {
  generateAccessToken(
    userId: number,
    email: string,
    roles: string[],
    stateId?: number | null,
    municipalityId?: number | null
  ): string;

  generateRefreshToken(userId: number): string;

  verifyAccessToken(token: string): TokenPayload;

  verifyRefreshToken(token: string): RefreshTokenPayload;

  generateRandomToken(): string;

  generateNumericCode(length?: number): string;
}
