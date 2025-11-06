import { Repository, DataSource } from 'typeorm';
import { IUserAvailabilityRepository } from '../../domain/interfaces/user-availability.repository.interface';
import { UserAvailability, DayOfWeek } from '../../domain/entities/user-availability.entity';
import { UserAvailabilitySchema } from '../../database/schemas/user-availability.schema';

export class UserAvailabilityAdapter implements IUserAvailabilityRepository {
  private repository: Repository<UserAvailabilitySchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserAvailabilitySchema);
  }

  async findById(id: number): Promise<UserAvailability | null> {
    const availabilitySchema = await this.repository.findOne({ where: { id } });
    if (!availabilitySchema) return null;
    return this.toDomain(availabilitySchema);
  }

  async findByUserId(userId: number): Promise<UserAvailability[]> {
    const availabilitySchemas = await this.repository.find({
      where: { userId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' }
    });
    return availabilitySchemas.map(schema => this.toDomain(schema));
  }

  async findByUserIdAndDay(userId: number, dayOfWeek: DayOfWeek): Promise<UserAvailability[]> {
    const availabilitySchemas = await this.repository.find({
      where: { userId, dayOfWeek },
      order: { startTime: 'ASC' }
    });
    return availabilitySchemas.map(schema => this.toDomain(schema));
  }

  async create(availability: UserAvailability): Promise<UserAvailability> {
    const availabilitySchema = this.toSchema(availability);
    const saved = await this.repository.save(availabilitySchema);
    return this.toDomain(saved);
  }

  async update(availability: UserAvailability): Promise<UserAvailability> {
    const availabilitySchema = this.toSchema(availability);
    await this.repository.save(availabilitySchema);
    return availability;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  private toDomain(schema: UserAvailabilitySchema): UserAvailability {
    return new UserAvailability(
      schema.id,
      schema.userId,
      schema.dayOfWeek as DayOfWeek,
      schema.startTime,
      schema.endTime,
      schema.createdAt,
      schema.updatedAt
    );
  }

  private toSchema(availability: UserAvailability): UserAvailabilitySchema {
    const schema = new UserAvailabilitySchema();
    schema.id = availability.id;
    schema.userId = availability.userId;
    schema.dayOfWeek = availability.dayOfWeek;
    schema.startTime = availability.startTime;
    schema.endTime = availability.endTime;
    schema.createdAt = availability.createdAt;
    schema.updatedAt = availability.updatedAt;
    return schema;
  }
}