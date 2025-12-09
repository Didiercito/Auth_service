import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { RoleSchema } from '../../database/schemas/role.schema';
import { UserRoleSchema } from '../../database/schemas/user-role.schema';
import { IRoleRepository } from '../../domain/interfaces/role.repository.interface';
import { Role } from '../../domain/entities/role.entity';

export class RoleRepository implements IRoleRepository {
  private repository: Repository<RoleSchema>;
  private userRoleRepository: Repository<UserRoleSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoleSchema);
    this.userRoleRepository = AppDataSource.getRepository(UserRoleSchema);
  }

  async save(role: Role): Promise<Role> {
    const schema = this.repository.create({
      name: role.name,
      description: role.description,
      level: role.level
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Role | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const schema = await this.repository.findOne({ where: { name } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Role[]> {
    const schemas = await this.repository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: number, role: Partial<Role>): Promise<Role> {
    await this.repository.update(id, {
      ...(role.name && { name: role.name }),
      ...(role.description !== undefined && { description: role.description }),
      ...(role.level && { level: role.level }),
      updatedAt: new Date()
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Role not found after update');
    }
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async assignRoleToUser(userId: number, roleId: number, assignedBy?: number): Promise<void> {
    const userRole = this.userRoleRepository.create({
      userId,
      roleId,
      assignedBy: assignedBy || null,
      isPrimary: false
    });

    await this.userRoleRepository.save(userRole);
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.userRoleRepository.delete({ userId, roleId });
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role']
    });

    return userRoles.map(ur => this.toDomain(ur.role));
  }

  async setPrimaryRole(userId: number, roleId: number): Promise<void> {
    await this.userRoleRepository.update(
      { userId },
      { isPrimary: false }
    );

    await this.userRoleRepository.update(
      { userId, roleId },
      { isPrimary: true }
    );
  }

  // 👇 MÉTODO AGREGADO PARA ELIMINAR CUENTA
  async removeAllRolesFromUser(userId: number): Promise<void> {
    await this.userRoleRepository.delete({ userId });
  }

  private toDomain(schema: RoleSchema): Role {
    return new Role(
      schema.id,
      schema.name,
      schema.description,
      schema.level,
      schema.createdAt,
      schema.updatedAt
    );
  }
}
