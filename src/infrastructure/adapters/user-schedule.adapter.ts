import { Repository, DataSource, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { IUserScheduleRepository } from '../../domain/interfaces/user-schedule.repository.interface';
import { UserSchedule } from '../../domain/entities/user-schedule.entity';
import { UserScheduleSchema } from '../../database/schemas/user-schedule.schema';

export class UserScheduleAdapter implements IUserScheduleRepository {
  private repository: Repository<UserScheduleSchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserScheduleSchema);
  }

  async findById(id: number): Promise<UserSchedule | null> {
    const scheduleSchema = await this.repository.findOne({ where: { id } });
    if (!scheduleSchema) return null;
    return this.toDomain(scheduleSchema);
  }

  async findByUserId(userId: number): Promise<UserSchedule[]> {
    const scheduleSchemas = await this.repository.find({
      where: { userId },
      order: { startDateTime: 'ASC' }
    });
    return scheduleSchemas.map(schema => this.toDomain(schema));
  }

  async findByUserIdPaginated(params: {
    userId: number;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date;
    eventId?: number;
  }): Promise<{ data: UserSchedule[]; total: number }> {
    const { userId, page, limit, startDate, endDate, eventId } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (eventId !== undefined) {
      where.eventId = eventId;
    }

    if (startDate && endDate) {
      where.startDateTime = Between(startDate, endDate);
    } else if (startDate) {
      where.startDateTime = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.startDateTime = LessThanOrEqual(endDate);
    }

    const [scheduleSchemas, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { startDateTime: 'ASC' }
    });

    const data = scheduleSchemas.map(schema => this.toDomain(schema));

    return { data, total };
  }

  async findByEventId(eventId: number): Promise<UserSchedule[]> {
    const scheduleSchemas = await this.repository.find({
      where: { eventId },
      order: { startDateTime: 'ASC' }
    });
    return scheduleSchemas.map(schema => this.toDomain(schema));
  }

  async findConflicts(userId: number, startDateTime: Date, endDateTime: Date): Promise<UserSchedule[]> {
    const scheduleSchemas = await this.repository
      .createQueryBuilder('schedule')
      .where('schedule.userId = :userId', { userId })
      .andWhere(
        '(schedule.startDateTime < :endDateTime AND schedule.endDateTime > :startDateTime)',
        { startDateTime, endDateTime }
      )
      .getMany();

    return scheduleSchemas.map(schema => this.toDomain(schema));
  }

  async findConflictsExcluding(
    userId: number,
    startDateTime: Date,
    endDateTime: Date,
    excludeScheduleId: number
  ): Promise<UserSchedule[]> {
    const scheduleSchemas = await this.repository
      .createQueryBuilder('schedule')
      .where('schedule.userId = :userId', { userId })
      .andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId })
      .andWhere(
        '(schedule.startDateTime < :endDateTime AND schedule.endDateTime > :startDateTime)',
        { startDateTime, endDateTime }
      )
      .getMany();

    return scheduleSchemas.map(schema => this.toDomain(schema));
  }

  async create(schedule: UserSchedule): Promise<UserSchedule> {
    const scheduleSchema = this.toSchema(schedule);
    const saved = await this.repository.save(scheduleSchema);
    return this.toDomain(saved);
  }

  async update(schedule: UserSchedule): Promise<UserSchedule> {
    const scheduleSchema = this.toSchema(schedule);
    await this.repository.save(scheduleSchema);
    return schedule;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  async deleteByEventId(eventId: number): Promise<void> {
    await this.repository.delete({ eventId });
  }

  private toDomain(schema: UserScheduleSchema): UserSchedule {
    return new UserSchedule(
      schema.id,
      schema.userId,
      schema.startDateTime,
      schema.endDateTime,
      schema.notes,
      schema.eventId,
      schema.createdAt,
      schema.updatedAt,
      schema.createdBy
    );
  }

  private toSchema(schedule: UserSchedule): UserScheduleSchema {
    const schema = new UserScheduleSchema();
    schema.id = schedule.id;
    schema.userId = schedule.userId;
    schema.startDateTime = schedule.startDateTime;
    schema.endDateTime = schedule.endDateTime;
    schema.notes = schedule.notes ?? null; 
    schema.eventId = schedule.eventId ?? null; 
    schema.createdAt = schedule.createdAt;
    schema.updatedAt = schedule.updatedAt;
    schema.createdBy = schedule.createdBy ?? null;  
    return schema;
  }

}