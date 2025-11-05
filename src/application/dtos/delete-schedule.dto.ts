import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';

export class DeleteScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  scheduleId: number;

  constructor(scheduleId: number) {
    this.scheduleId = scheduleId;
  }
}