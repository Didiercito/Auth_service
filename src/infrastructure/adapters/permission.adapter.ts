import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { PermissionSchema } from '../../database/schemas/permission.schema';
import { RoleSchema } from '../../database/schemas/role.schema';
import { UserRoleSchema } from '../../database/schemas/user-role.schema';
import { IPermissionRepository } from '../../domain/interfaces/permission.repository.interface';
import { Permission } from '../../domain/entities/permission.entity';

export class PermissionRepository implements IPermissionRepository {
  private repository: Repository<PermissionSchema>;
  private roleRepository: Repository<RoleSchema>;
  private userRoleRepository: Repository<UserRoleSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(PermissionSchema);
    this.roleRepository = AppDataSource.getRepository(RoleSchema);
    this.userRoleRepository = AppDataSource.getRepository(UserRoleSchema);
  }

  async save(permission: Permission): Promise<Permission> {
    const schema = this.repository.create({
      module: permission.module,
      action: permission.action,
      resource: permission.resource,
      description: permission.description
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Permission | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByModuleActionResource(
    module: string,
    action: string,
    resource: string
  ): Promise<Permission | null> {
    const schema = await this.repository.findOne({
      where: { module, action, resource }
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Permission[]> {
    const schemas = await this.repository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByModule(module: string): Promise<Permission[]> {
    const schemas = await this.repository.find({ where: { module } });
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: number, permission: Partial<Permission>): Promise<Permission> {
    await this.repository.update(id, {
      ...(permission.module && { module: permission.module }),
      ...(permission.action && { action: permission.action }),
      ...(permission.resource && { resource: permission.resource }),
      ...(permission.description !== undefined && { description: permission.description })
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Permission not found after update');
    }
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions']
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const permission = await this.repository.findOne({ where: { id: permissionId } });

    if (!permission) {
      throw new Error('Permission not found');
    }

    if (!role.permissions) {
      role.permissions = [];
    }

    role.permissions.push(permission);
    await this.roleRepository.save(role);
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions']
    });

    if (!role) {
      throw new Error('Role not found');
    }

    role.permissions = role.permissions.filter(p => p.id !== permissionId);
    await this.roleRepository.save(role);
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions']
    });

    if (!role || !role.permissions) {
      return [];
    }

    return role.permissions.map(schema => this.toDomain(schema));
  }

  async getUserPermissions(userId: number): Promise<Permission[]> {
    // Obtener roles del usuario
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role', 'role.permissions']
    });

    // Consolidar permisos únicos de todos los roles
    const permissionsMap = new Map<number, PermissionSchema>();

    userRoles.forEach(userRole => {
      if (userRole.role && userRole.role.permissions) {
        userRole.role.permissions.forEach(permission => {
          permissionsMap.set(permission.id, permission);
        });
      }
    });

    return Array.from(permissionsMap.values()).map(schema => this.toDomain(schema));
  }

  async userHasPermission(
    userId: number,
    module: string,
    action: string,
    resource: string
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);

    return userPermissions.some(
      p => p.module === module && p.action === action && p.resource === resource
    );
  }

  private toDomain(schema: PermissionSchema): Permission {
    return new Permission(
      schema.id,
      schema.module,
      schema.action,
      schema.resource,
      schema.description
    );
  }
}