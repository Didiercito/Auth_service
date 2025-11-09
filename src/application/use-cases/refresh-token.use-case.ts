import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenGenerator: ITokenGenerator,
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  async execute(dto: any): Promise<RefreshTokenResponse> {
    if (!dto.refreshToken) {
      throw { http_status: 400, message: 'Refresh token is required' };
    }

    try {
      const payload = this.tokenGenerator.verifyRefreshToken(dto.refreshToken);
      const user = await this.userRepository.findById(payload.userId);

      if (!user) {
        throw {
          http_status: 401,
          message: 'Invalid refresh token'
        };
      }

      if (user.status !== 'active') {
        throw {
          http_status: 403,
          message: 'User account is not active'
        };
      }

      const roles = await this.roleRepository.getUserRoles(user.id);
      const roleNames = roles.map(role => role.name);
      const accessToken = this.tokenGenerator.generateAccessToken(
        user.id,
        user.email,
        roleNames
      );
      const refreshToken = this.tokenGenerator.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw {
        http_status: 401,
        message: 'Invalid or expired refresh token'
      };
    }
  }
}