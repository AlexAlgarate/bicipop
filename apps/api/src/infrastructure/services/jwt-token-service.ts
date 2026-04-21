import { TokenPayload, TokenService } from '@domain/services/TokenService';
import jwt from 'jsonwebtoken';

interface EnvironmentService {
  get(): {
    JWT_SECRET: string;
  };
}

export class JwtTokenService implements TokenService {
  private readonly jwtSecret: string;

  constructor(private readonly environmentService: EnvironmentService) {
    this.jwtSecret = this.environmentService.get().JWT_SECRET;
  }

  generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1d',
      algorithm: 'HS256',
    });
  }

  verify(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
      }) as TokenPayload;
    } catch (_error) {
      return null;
    }
  }
}
