import { UserSkill } from '../entities/user-skill.entity';
import { validate, ValidationError } from 'class-validator';

export class UserSkillValidator {
  constructor(private userSkill: UserSkill) {}

  async validateOrThrow(): Promise<void> {
    const errors: ValidationError[] = await validate(this.userSkill);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {})
      }));

      throw {
        http_status: 422,
        message: 'User skill validation failed',
        validations: validationErrors
      };
    }
  }

  async validateWithCustomRules(): Promise<void> {
    await this.validateOrThrow();

    if (this.userSkill.userId <= 0) {
      throw {
        http_status: 422,
        message: 'Invalid user ID',
        validations: [{
          property: 'userId',
          errorMessages: ['User ID must be a positive number']
        }]
      };
    }

    if (this.userSkill.skillId <= 0) {
      throw {
        http_status: 422,
        message: 'Invalid skill ID',
        validations: [{
          property: 'skillId',
          errorMessages: ['Skill ID must be a positive number']
        }]
      };
    }

    if (this.userSkill.proficiencyLevel !== null && this.userSkill.proficiencyLevel !== undefined) {
      if (this.userSkill.proficiencyLevel < 1 || this.userSkill.proficiencyLevel > 5) {
        throw {
          http_status: 422,
          message: 'Invalid proficiency level',
          validations: [{
            property: 'proficiencyLevel',
            errorMessages: ['Proficiency level must be between 1 and 5']
          }]
        };
      }
    }

    if (this.userSkill.yearsOfExperience !== null && this.userSkill.yearsOfExperience !== undefined) {
      if (this.userSkill.yearsOfExperience < 0) {
        throw {
          http_status: 422,
          message: 'Invalid years of experience',
          validations: [{
            property: 'yearsOfExperience',
            errorMessages: ['Years of experience cannot be negative']
          }]
        };
      }

      if (this.userSkill.yearsOfExperience > 100) {
        throw {
          http_status: 422,
          message: 'Invalid years of experience',
          validations: [{
            property: 'yearsOfExperience',
            errorMessages: ['Years of experience seems unrealistic (max 100)']
          }]
        };
      }
    }
  }
}