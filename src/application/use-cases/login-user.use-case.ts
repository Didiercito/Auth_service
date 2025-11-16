import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { ITokenGenerator } from '../../domain/interfaces/token-generator.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { UserStatus } from '../../domain/entities/user.entity';

export interface LoginUserResponse {
  user: {
    id: number;
    email: string;
    names: string;
    fullName: string;
    status: UserStatus;
    verifiedEmail: boolean;
    verifiedPhone: boolean;
    stateId: number | null;
    municipalityId: number | null;
  };
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  async execute(dto: any): Promise<LoginUserResponse> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw { http_status: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw { http_status: 401, message: 'Invalid credentials' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw { http_status: 403, message: 'Account suspended. Please contact support.' };
    }

    if (user.status === UserStatus.INACTIVE) {
      throw { http_status: 403, message: 'Account inactive. Please contact support.' };
    }

    const roles = await this.roleRepository.getUserRoles(user.id);
    const roleNames = roles.map((role) => role.name);

    const stateId = user.stateId ?? null;
    const municipalityId = user.municipalityId ?? null;

    const accessToken = this.tokenGenerator.generateAccessToken(
      user.id,
      user.email,
      roleNames,
      stateId,
      municipalityId
    );

    const refreshToken = this.tokenGenerator.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        names: user.names,
        fullName: `${user.names} ${user.firstLastName} ${user.secondLastName}`,
        status: user.status,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
        stateId,
        municipalityId
      },
      accessToken,
      refreshToken,
      roles: roleNames
    };
  }
}
