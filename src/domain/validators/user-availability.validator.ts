import { UserAvailability } from '../entities/user-availability.entity';
import { validate, ValidationError } from 'class-validator';

export class UserAvailabilityValidator {
  constructor(private availability: UserAvailability) {}

  async validateOrThrow(): Promise<void> {
    const errors: ValidationError[] = await validate(this.availability);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {})
      }));

      throw {
        http_status: 422,
        message: 'Availability validation failed',
        validations: validationErrors
      };
    }
  }

  async validateWithCustomRules(): Promise<void> {
    await this.validateOrThrow();

    if (this.availability.userId <= 0) {
      throw {
        http_status: 422,
        message: 'Invalid user ID',
        validations: [{
          property: 'userId',
          errorMessages: ['User ID must be a positive number']
        }]
      };
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(this.availability.startTime)) {
      throw {
        http_status: 422,
        message: 'Invalid start time format',
        validations: [{
          property: 'startTime',
          errorMessages: ['Start time must be in format HH:mm (e.g., 09:00)']
        }]
      };
    }

    if (!timeRegex.test(this.availability.endTime)) {
      throw {
        http_status: 422,
        message: 'Invalid end time format',
        validations: [{
          property: 'endTime',
          errorMessages: ['End time must be in format HH:mm (e.g., 17:00)']
        }]
      };
    }

    const startMinutes = this.timeToMinutes(this.availability.startTime);
    const endMinutes = this.timeToMinutes(this.availability.endTime);

    if (startMinutes >= endMinutes) {
      throw {
        http_status: 422,
        message: 'Invalid time range',
        validations: [{
          property: 'startTime',
          errorMessages: ['Start time must be before end time']
        }]
      };
    }

    const durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 30) {
      throw {
        http_status: 422,
        message: 'Availability duration too short',
        validations: [{
          property: 'startTime',
          errorMessages: ['Availability must be at least 30 minutes']
        }]
      };
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}