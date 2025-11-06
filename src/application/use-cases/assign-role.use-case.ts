import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { IEventPublisher } from '../../domain/interfaces/event-publisher.interface';
import { AssignRoleDto } from '../dtos/assign-role.dto';

export class AssignRoleUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(dto: AssignRoleDto): Promise<{ message: string }> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw {
        http_status: 404,
        message: 'User not found'
      };
    }

    const role = await this.roleRepository.findById(dto.roleId);

    if (!role) {
      throw {
        http_status: 404,
        message: 'Role not found'
      };
    }

    const userRoles = await this.roleRepository.getUserRoles(dto.userId);
    const hasRole = userRoles.some(r => r.id === dto.roleId);

    if (hasRole) {
      throw {
        http_status: 400,
        message: 'User already has this role'
      };
    }

    await this.roleRepository.assignRoleToUser(
      dto.userId,
      dto.roleId,
      dto.assignedBy
    );

    if (dto.isPrimary) {
      await this.roleRepository.setPrimaryRole(dto.userId, dto.roleId);
    }

    await this.eventPublisher.publish('user.role.assigned', {
      userId: dto.userId,
      roleId: dto.roleId,
      roleName: role.name,
      assignedBy: dto.assignedBy,
      isPrimary: dto.isPrimary || false,
      timestamp: new Date().toISOString()
    });

    return {
      message: `Role '${role.name}' assigned successfully to user`
    };
  }
}