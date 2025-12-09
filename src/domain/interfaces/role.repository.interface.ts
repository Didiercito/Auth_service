import { Role } from '../entities/role.entity';

export interface IRoleRepository {
  save(role: Role): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
  existsByName(name: string): Promise<boolean>;
  assignRoleToUser(userId: number, roleId: number, assignedBy?: number): Promise<void>;
  removeRoleFromUser(userId: number, roleId: number): Promise<void>;
  getUserRoles(userId: number): Promise<Role[]>;
  setPrimaryRole(userId: number, roleId: number): Promise<void>;
  removeAllRolesFromUser(userId: number): Promise<void>;
}