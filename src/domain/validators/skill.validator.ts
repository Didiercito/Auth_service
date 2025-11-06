import { Skill } from '../entities/skill.entity';
import { validate, ValidationError } from 'class-validator';

export class SkillValidator {
  constructor(private skill: Skill) {}

  async validateOrThrow(): Promise<void> {
    const errors: ValidationError[] = await validate(this.skill);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        errorMessages: Object.values(error.constraints || {})
      }));

      throw {
        http_status: 422,
        message: 'Skill validation failed',
        validations: validationErrors
      };
    }
  }

  async validateWithCustomRules(): Promise<void> {
    await this.validateOrThrow();

    if (!this.skill.name || this.skill.name.trim().length === 0) {
      throw {
        http_status: 422,
        message: 'Skill name cannot be empty',
        validations: [{
          property: 'name',
          errorMessages: ['Name cannot be empty or whitespace']
        }]
      };
    }

    if (this.skill.name.trim().length < 2) {
      throw {
        http_status: 422,
        message: 'Skill name too short',
        validations: [{
          property: 'name',
          errorMessages: ['Name must be at least 2 characters long']
        }]
      };
    }

    if (this.skill.name.length > 100) {
      throw {
        http_status: 422,
        message: 'Skill name too long',
        validations: [{
          property: 'name',
          errorMessages: ['Name must not exceed 100 characters']
        }]
      };
    }

    if (this.skill.description && this.skill.description.length > 500) {
      throw {
        http_status: 422,
        message: 'Skill description too long',
        validations: [{
          property: 'description',
          errorMessages: ['Description must not exceed 500 characters']
        }]
      };
    }
  }
}