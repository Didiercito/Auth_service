import { UserSchedule } from '../entities/user-schedule.entity';

export interface IUserScheduleRepository {
  findById(id: number): Promise<UserSchedule | null>;
  findByUserId(userId: number): Promise<UserSchedule[]>;
  findByUserIdPaginated(params: {
    userId: number;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date;
    eventId?: number;
  }): Promise<{ data: UserSchedule[]; total: number }>;
  findByEventId(eventId: number): Promise<UserSchedule[]>;
  findConflicts(userId: number, startDateTime: Date, endDateTime: Date): Promise<UserSchedule[]>;
  findConflictsExcluding(
    userId: number,
    startDateTime: Date,
    endDateTime: Date,
    excludeScheduleId: number
  ): Promise<UserSchedule[]>;
  create(schedule: UserSchedule): Promise<UserSchedule>;
  update(schedule: UserSchedule): Promise<UserSchedule>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  deleteByEventId(eventId: number): Promise<void>;
}