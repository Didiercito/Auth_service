import { UserAvailability, DayOfWeek } from '../entities/user-availability.entity';

export interface IUserAvailabilityRepository {
  findById(id: number): Promise<UserAvailability | null>;
  findByUserId(userId: number): Promise<UserAvailability[]>;
  findByUserIdAndDay(userId: number, dayOfWeek: DayOfWeek): Promise<UserAvailability[]>;
  create(availability: UserAvailability): Promise<UserAvailability>;
  update(availability: UserAvailability): Promise<UserAvailability>;
  delete(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
}