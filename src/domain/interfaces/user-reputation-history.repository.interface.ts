import { UserReputationHistory } from '../entities/user-reputation-history.entity';

export interface IUserReputationHistoryRepository {
  findById(id: number): Promise<UserReputationHistory | null>;
  findByUserId(userId: number): Promise<UserReputationHistory[]>;
  findByUserIdPaginated(params: {
    userId: number;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ data: UserReputationHistory[]; total: number }>;
  findByEventId(eventId: number): Promise<UserReputationHistory[]>;
  create(history: UserReputationHistory): Promise<UserReputationHistory>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
}