import { IPermissionRepository } from '../../domain/interfaces/permission.repository.interface';
import { GetUserPermissionsDto } from '../dtos/get-user-permissions.dto';

export interface UserPermissionsResponse {
  userId: number;
  permissions: {
    id: number;
    module: string;
    action: string;
    resource: string;
    permissionString: string;
  }[];
  totalPermissions: number;
}

export class GetUserPermissionsUseCase {
  constructor(
    private readonly permissionRepository: IPermissionRepository
  ) {}

  async execute(dto: GetUserPermissionsDto): Promise<UserPermissionsResponse> {
    const permissions = await this.permissionRepository.getUserPermissions(dto.userId);

    const formattedPermissions = permissions.map(permission => ({
      id: permission.id,
      module: permission.module,
      action: permission.action,
      resource: permission.resource,
      permissionString: `${permission.module}:${permission.action}:${permission.resource}`
    }));

    return {
      userId: dto.userId,
      permissions: formattedPermissions,
      totalPermissions: formattedPermissions.length
    };
  }
}