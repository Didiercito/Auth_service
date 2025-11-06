import { UserReputationHistory } from '../entities/user-reputation-history.entity';
import { validate, ValidationError } from 'class-validator';

export class UserReputationHistoryValidator {
  constructor(private history: UserReputationHistory) {}

  async validateOrThrow(): Promise<void> {
    const errors: ValidationError[] = await validate(this.history);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {})
      }));

      throw {
        http_status: 422,
        message: 'Reputation history validation failed',
        validations: validationErrors
      };
    }
  }

  async validateWithCustomRules(): Promise<void> {
    await this.validateOrThrow();

    if (this.history.userId <= 0) {
      throw {
        http_status: 422,
        message: 'Invalid user ID',
        validations: [{
          property: 'userId',
          errorMessages: ['User ID must be a positive number']
        }]
      };
    }

    if (this.history.changeAmount < -100 || this.history.changeAmount > 100) {
      throw {
        http_status: 422,
        message: 'Invalid change amount',
        validations: [{
          property: 'changeAmount',
          errorMessages: ['Change amount must be between -100 and 100']
        }]
      };
    }

    if (this.history.changeAmount === 0) {
      throw {
        http_status: 422,
        message: 'Invalid change amount',
        validations: [{
          property: 'changeAmount',
          errorMessages: ['Change amount cannot be zero']
        }]
      };
    }

    if (this.history.previousScore < 0 || this.history.previousScore > 100) {
      throw {
        http_status: 422,
        message: 'Invalid previous score',
        validations: [{
          property: 'previousScore',
          errorMessages: ['Previous score must be between 0 and 100']
        }]
      };
    }

    if (this.history.newScore < 0 || this.history.newScore > 100) {
      throw {
        http_status: 422,
        message: 'Invalid new score',
        validations: [{
          property: 'newScore',
          errorMessages: ['New score must be between 0 and 100']
        }]
      };
    }

    const expectedNewScore = Math.max(0, Math.min(100, this.history.previousScore + this.history.changeAmount));
    if (this.history.newScore !== expectedNewScore) {
      throw {
        http_status: 422,
        message: 'Reputation calculation error',
        validations: [{
          property: 'newScore',
          errorMessages: ['New score does not match expected calculation']
        }]
      };
    }

    if (!this.history.reason || this.history.reason.trim().length < 3) {
      throw {
        http_status: 422,
        message: 'Invalid reason',
        validations: [{
          property: 'reason',
          errorMessages: ['Reason must be at least 3 characters long']
        }]
      };
    }

    if (this.history.reason.length > 100) {
      throw {
        http_status: 422,
        message: 'Reason too long',
        validations: [{
          property: 'reason',
          errorMessages: ['Reason must not exceed 100 characters']
        }]
      };
    }

    if (this.history.details && this.history.details.length > 500) {
      throw {
        http_status: 422,
        message: 'Details too long',
        validations: [{
          property: 'details',
          errorMessages: ['Details must not exceed 500 characters']
        }]
      };
    }
  }
}