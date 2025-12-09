import { EmailVerification } from '../entities/email-verification.entity';

export interface IEmailVerificationRepository {
  save(emailVerification: EmailVerification): Promise<EmailVerification>;
  findById(id: number): Promise<EmailVerification | null>;
  findByToken(token: string): Promise<EmailVerification | null>;
  findByUserId(userId: number): Promise<EmailVerification[]>;
  findLatestByUserId(userId: number): Promise<EmailVerification | null>;
  update(id: number, emailVerification: Partial<EmailVerification>): Promise<EmailVerification>;
  delete(id: number): Promise<void>;
  deleteExpired(): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
}