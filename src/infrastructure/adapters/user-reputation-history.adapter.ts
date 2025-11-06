import { Repository, DataSource, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { IUserReputationHistoryRepository } from '../../domain/interfaces/user-reputation-history.repository.interface';
import { UserReputationHistory } from '../../domain/entities/user-reputation-history.entity';
import { UserReputationHistorySchema } from '../../database/schemas/user-reputation-history.schema';

export class UserReputationHistoryAdapter implements IUserReputationHistoryRepository {
  private repository: Repository<UserReputationHistorySchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserReputationHistorySchema);
  }

  async findById(id: number): Promise<UserReputationHistory | null> {
    const historySchema = await this.repository.findOne({ where: { id } });
    if (!historySchema) return null;
    return this.toDomain(historySchema);
  }

  async findByUserId(userId: number): Promise<UserReputationHistory[]> {
    const historySchemas = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return historySchemas.map(schema => this.toDomain(schema));
  }

  async findByUserIdPaginated(params: {
    userId: number;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ data: UserReputationHistory[]; total: number }> {
    const { userId, page, limit, startDate, endDate } = params;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    const [historySchemas, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const data = historySchemas.map(schema => this.toDomain(schema));

    return { data, total };
  }

  async findByEventId(eventId: number): Promise<UserReputationHistory[]> {
    const historySchemas = await this.repository.find({
      where: { relatedEventId: eventId },
      order: { createdAt: 'DESC' }
    });
    return historySchemas.map(schema => this.toDomain(schema));
  }

  async create(history: UserReputationHistory): Promise<UserReputationHistory> {
    const historySchema = this.toSchema(history);
    const saved = await this.repository.save(historySchema);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  private toDomain(schema: UserReputationHistorySchema): UserReputationHistory {
    return new UserReputationHistory(
      schema.id,
      schema.userId,
      schema.changeAmount,
      schema.previousScore,
      schema.newScore,
      schema.reason,
      schema.details,
      schema.relatedEventId,
      schema.createdAt,
      schema.createdBy
    );
  }

private toSchema(history: UserReputationHistory): UserReputationHistorySchema {
  const schema = new UserReputationHistorySchema();
  schema.id = history.id;
  schema.userId = history.userId;
  schema.changeAmount = history.changeAmount;
  schema.previousScore = history.previousScore;
  schema.newScore = history.newScore;
  schema.reason = history.reason;
  schema.details = history.details || '';
  schema.relatedEventId = history.relatedEventId ?? null; 
  schema.createdAt = history.createdAt;
  schema.createdBy = history.createdBy ?? null;
  return schema;
}

}