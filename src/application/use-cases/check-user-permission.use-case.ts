import { IPermissionRepository } from '../../domain/interfaces/permission.repository.interface';

export interface CheckUserPermissionDto {
  userId: number;
  module: string;
  action: string;
  resource: string;
}

export interface CheckUserPermissionResponse {
  hasPermission: boolean;
  userId: number;
  permission: string;
}

export class CheckUserPermissionUseCase {
  constructor(
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async execute(dto: CheckUserPermissionDto): Promise<CheckUserPermissionResponse> {
    const hasPermission = await this.permissionRepository.userHasPermission(
      dto.userId,
      dto.module,
      dto.action,
      dto.resource
    );

    return {
      hasPermission,
      userId: dto.userId,
      permission: `${dto.module}:${dto.action}:${dto.resource}`
    };
  }
}