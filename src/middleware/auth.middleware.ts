import { Request, Response, NextFunction } from 'express';
import { JwtTokenGeneratorService } from '../services/jwt-token-generator.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        roles?: string[];
        stateId: number | null;
        municipalityId: number | null;
      };
    }
  }
}

export class AuthMiddleware {
  private tokenGenerator: JwtTokenGeneratorService;

  constructor() {
    this.tokenGenerator = new JwtTokenGeneratorService();
  }

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o no proporcionado'
        });
        return;
      }

      const token = authHeader.substring(7);

      const payload = this.tokenGenerator.verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
        roles: payload.roles,
        stateId: payload.stateId,
        municipalityId: payload.municipalityId
      };

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  };

  authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Autenticación requerida'
        });
        return;
      }

      const userRoles = req.user.roles || [];
      const hasRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        res.status(403).json({
          success: false,
          message: 'Permisos insuficientes',
          requiredRoles: allowedRoles,
          userRoles
        });
        return;
      }

      next();
    };
  };
}