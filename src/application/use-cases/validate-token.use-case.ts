import { ITokenGenerator, TokenPayload } from '../../domain/interfaces/token-generator.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface'
import { ValidateTokenDto } from '../dtos/validate-token.dto';

export interface ValidateTokenResponse {
  isValid: boolean;
  user?: {
    id: number;
    email: string;
    roles?: string[];
  };
}

export class ValidateTokenUseCase {
  constructor(
    private readonly tokenGenerator: ITokenGenerator,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: ValidateTokenDto): Promise<ValidateTokenResponse> {
    try {
      const payload: TokenPayload = this.tokenGenerator.verifyAccessToken(dto.token);

      const user = await this.userRepository.findById(payload.userId);

      if (!user) {
        return { isValid: false };
      }

      if (user.status !== 'active') {
        return { isValid: false };
      }

      return {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          roles: payload.roles
        }
      };

    } catch (error) {
      return { isValid: false };
    }
  }
}