import { Repository, DataSource } from 'typeorm';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { UserSchema } from '../../database/schemas/user.schema';

export class UserAdapter implements IUserRepository {
  private repository: Repository<UserSchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserSchema);
  }

  async findById(id: number): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { id } });
    if (!userSchema) return null;
    return this.toDomain(userSchema);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { email } });
    if (!userSchema) return null;
    return this.toDomain(userSchema);
  }

  async findByGoogleUserId(googleUserId: string): Promise<User | null> {
    const userSchema = await this.repository.findOne({ where: { googleUserId } });
    if (!userSchema) return null;
    return this.toDomain(userSchema);
  }

  async findAll(): Promise<User[]> {
    const userSchemas = await this.repository.find();
    return userSchemas.map(schema => this.toDomain(schema));
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: UserStatus;
    stateId?: number;
    municipalityId?: number;
  }): Promise<{ data: User[]; total: number }> {
    const { page, limit, search, status, stateId, municipalityId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (stateId !== undefined) {
      where.stateId = stateId;
    }

    if (municipalityId !== undefined) {
      where.municipalityId = municipalityId;
    }

    let queryBuilder = this.repository.createQueryBuilder('user');

    if (status) {
      queryBuilder = queryBuilder.andWhere('user.status = :status', { status });
    }

    if (stateId !== undefined) {
      queryBuilder = queryBuilder.andWhere('user.stateId = :stateId', { stateId });
    }

    if (municipalityId !== undefined) {
      queryBuilder = queryBuilder.andWhere('user.municipalityId = :municipalityId', { municipalityId });
    }

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.names LIKE :search OR user.firstLastName LIKE :search OR user.secondLastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [userSchemas, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    const data = userSchemas.map(schema => this.toDomain(schema));

    return { data, total };
  }

  async save(user: User): Promise<User> {
    const userSchema = new UserSchema();
    userSchema.names = user.names;
    userSchema.firstLastName = user.firstLastName;
    userSchema.secondLastName = user.secondLastName;
    userSchema.email = user.email;
    userSchema.passwordHash = user.passwordHash;
    userSchema.imageProfile = user.imageProfile || '';
    userSchema.phoneNumber = user.phoneNumber ?? null;
    userSchema.reputationScore = user.reputationScore;
    userSchema.googleUserId = user.googleUserId ?? null;
    userSchema.status = user.status;
    userSchema.verifiedEmail = user.verifiedEmail;
    userSchema.verifiedPhone = user.verifiedPhone;
    userSchema.emailVerifiedAt = user.emailVerifiedAt ?? null;
    userSchema.phoneVerifiedAt = user.phoneVerifiedAt ?? null;
    userSchema.stateId = user.stateId ?? null;
    userSchema.municipalityId = user.municipalityId ?? null;
    userSchema.createdBy = user.createdBy ?? null;

    const savedUser = await this.repository.save(userSchema);
    return this.toDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const userSchema = new UserSchema();
    userSchema.id = user.id;
    userSchema.names = user.names;
    userSchema.firstLastName = user.firstLastName;
    userSchema.secondLastName = user.secondLastName;
    userSchema.email = user.email;
    userSchema.passwordHash = user.passwordHash;
    userSchema.imageProfile = user.imageProfile || '';
    userSchema.phoneNumber = user.phoneNumber ?? null;
    userSchema.reputationScore = user.reputationScore;
    userSchema.googleUserId = user.googleUserId ?? null;
    userSchema.status = user.status;
    userSchema.verifiedEmail = user.verifiedEmail;
    userSchema.verifiedPhone = user.verifiedPhone;
    userSchema.emailVerifiedAt = user.emailVerifiedAt ?? null;
    userSchema.phoneVerifiedAt = user.phoneVerifiedAt ?? null;
    userSchema.stateId = user.stateId ?? null;
    userSchema.municipalityId = user.municipalityId ?? null;
    userSchema.updatedAt = user.updatedAt;
    userSchema.createdBy = user.createdBy ?? null;

    await this.repository.save(userSchema);
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: UserSchema): User {
    return new User(
      schema.id,
      schema.names,
      schema.firstLastName,
      schema.secondLastName,
      schema.email,
      schema.passwordHash,
      schema.imageProfile,
      schema.phoneNumber,
      Number(schema.reputationScore),
      schema.googleUserId,
      schema.status,
      schema.verifiedEmail,
      schema.verifiedPhone,
      schema.emailVerifiedAt,
      schema.phoneVerifiedAt,
      schema.stateId,
      schema.municipalityId,
      schema.createdAt,
      schema.updatedAt,
      schema.createdBy
    );
  }
}