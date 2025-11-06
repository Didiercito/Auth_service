import { User } from '../entities/user.entity';
import { BaseValidator } from './validator';

export class UserValidator extends BaseValidator<User> {
  constructor(user: User) {
    super(user);
  }

  public async validateWithCustomRules(): Promise<void> {
    await this.validate();

    if (this.isDisposableEmail(this.entity.email)) {
      this.listErrors.push({
        property: 'email',
        constraints: {
          isDisposable: 'Disposable email addresses are not allowed'
        },
        children: [],
        target: this.entity,
        value: this.entity.email
      });
    }

    if (/^\d+$/.test(this.entity.names)) {
      this.listErrors.push({
        property: 'names',
        constraints: {
          onlyNumbers: 'Names cannot contain only numbers'
        },
        children: [],
        target: this.entity,
        value: this.entity.names
      });
    }

    if (this.hasErrors()) {
      throw {
        http_status: 422,
        validations: this.getFormattedErrors()
      };
    }
  }


  public canPerformActions(): boolean {
    return this.entity.status === 'active';
  }


  public needsVerification(): boolean {
    return !this.entity.verifiedEmail || !this.entity.verifiedPhone;
  }


  private isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      'tempmail.com',
      'guerrillamail.com',
      'mailinator.com',
      '10minutemail.com',
      'throwaway.email'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }
}