import { User, UserStatus } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleUserId(googleUserId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: UserStatus;
    stateId?: number;
    municipalityId?: number;
  }): Promise<{ data: User[]; total: number }>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}