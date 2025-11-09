import { IPermissionRepository } from '../../domain/interfaces/permission.repository.interface';

export interface CheckUserPermissionResponse {
  hasPermission: boolean;
  userId: number;
  permission: string;
}

export class CheckUserPermissionUseCase {
  constructor(
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async execute(dto: any): Promise<CheckUserPermissionResponse> {
    if (!dto.userId || !dto.module || !dto.action || !dto.resource) {
      throw {
        http_status: 400,
        message: 'User ID, module, action, and resource are required'
      };
    }
    
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