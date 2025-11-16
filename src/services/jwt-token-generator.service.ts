import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  ITokenGenerator,
  TokenPayload,
  RefreshTokenPayload
} from '../domain/interfaces/token-generator.interface';

export class JwtTokenGeneratorService implements ITokenGenerator {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.accessTokenExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  }

  generateAccessToken(
    userId: number,
    email: string,
    roles: string[] = [],
    stateId: number | null = null,
    municipalityId: number | null = null
  ): string {
    
    const payload: TokenPayload = {
      userId,
      email,
      roles,
      stateId,
      municipalityId
    };

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiresIn as any,
      issuer: 'auth-service',
      audience: 'kitchen-volunteers-app'
    };

    return jwt.sign(payload, this.accessTokenSecret, options);
  }

  generateRefreshToken(userId: number): string {
    const payload: RefreshTokenPayload = { userId };

    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiresIn as any,
      issuer: 'auth-service',
      audience: 'kitchen-volunteers-app'
    };

    return jwt.sign(payload, this.refreshTokenSecret, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'auth-service',
        audience: 'kitchen-volunteers-app'
      });

      return decoded as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'auth-service',
        audience: 'kitchen-volunteers-app'
      });

      return decoded as RefreshTokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  generateRandomToken(): string {
    return uuidv4();
  }

  generateNumericCode(length: number = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }
}
