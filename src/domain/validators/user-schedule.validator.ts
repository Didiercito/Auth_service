import { UserSchedule } from '../entities/user-schedule.entity';
import { validate, ValidationError } from 'class-validator';

export class UserScheduleValidator {
  constructor(private schedule: UserSchedule) {}

  async validateOrThrow(): Promise<void> {
    const errors: ValidationError[] = await validate(this.schedule);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {})
      }));

      throw {
        http_status: 422,
        message: 'Schedule validation failed',
        validations: validationErrors
      };
    }
  }

  async validateWithCustomRules(): Promise<void> {
    await this.validateOrThrow();

    if (this.schedule.userId <= 0) {
      throw {
        http_status: 422,
        message: 'Invalid user ID',
        validations: [{
          property: 'userId',
          errorMessages: ['User ID must be a positive number']
        }]
      };
    }

    if (this.schedule.startDateTime >= this.schedule.endDateTime) {
      throw {
        http_status: 422,
        message: 'Invalid date range',
        validations: [{
          property: 'startDateTime',
          errorMessages: ['Start date/time must be before end date/time']
        }]
      };
    }

    const now = new Date();
    if (this.schedule.startDateTime < now) {
      throw {
        http_status: 422,
        message: 'Invalid start date',
        validations: [{
          property: 'startDateTime',
          errorMessages: ['Start date/time cannot be in the past']
        }]
      };
    }

    const durationMs = this.schedule.endDateTime.getTime() - this.schedule.startDateTime.getTime();
    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes < 30) {
      throw {
        http_status: 422,
        message: 'Schedule duration too short',
        validations: [{
          property: 'startDateTime',
          errorMessages: ['Schedule must be at least 30 minutes long']
        }]
      };
    }

    const maxDurationHours = 24;
    if (durationMinutes > maxDurationHours * 60) {
      throw {
        http_status: 422,
        message: 'Schedule duration too long',
        validations: [{
          property: 'endDateTime',
          errorMessages: [`Schedule cannot exceed ${maxDurationHours} hours`]
        }]
      };
    }

    if (this.schedule.notes && this.schedule.notes.length > 500) {
      throw {
        http_status: 422,
        message: 'Notes too long',
        validations: [{
          property: 'notes',
          errorMessages: ['Notes must not exceed 500 characters']
        }]
      };
    }
  }
}