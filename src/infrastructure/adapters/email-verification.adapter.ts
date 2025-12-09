import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { EmailVerificationSchema } from '../../database/schemas/email-verification.schema';
import { IEmailVerificationRepository } from '../../domain/interfaces/email-verification.repository.interface';
import { EmailVerification } from '../../domain/entities/email-verification.entity';

export class EmailVerificationRepository implements IEmailVerificationRepository {
  private repository: Repository<EmailVerificationSchema>;

  constructor() {
    this.repository = AppDataSource.getRepository(EmailVerificationSchema);
  }

  async save(emailVerification: EmailVerification): Promise<EmailVerification> {
    const schema = this.repository.create({
      userId: emailVerification.userId,
      token: emailVerification.token,
      expiresAt: emailVerification.expiresAt,
      isUsed: emailVerification.isUsed,
      usedAt: emailVerification.usedAt
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<EmailVerification | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByToken(token: string): Promise<EmailVerification | null> {
    const schema = await this.repository.findOne({ where: { token } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: number): Promise<EmailVerification[]> {
    const schemas = await this.repository.find({ where: { userId } });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findLatestByUserId(userId: number): Promise<EmailVerification | null> {
    const schema = await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return schema ? this.toDomain(schema) : null;
  }

  async update(id: number, emailVerification: Partial<EmailVerification>): Promise<EmailVerification> {
    await this.repository.update(id, {
      ...(emailVerification.isUsed !== undefined && { isUsed: emailVerification.isUsed }),
      ...(emailVerification.usedAt !== undefined && { usedAt: emailVerification.usedAt })
    });

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Email verification not found after update');
    }
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteExpired(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }

  private toDomain(schema: EmailVerificationSchema): EmailVerification {
    return new EmailVerification(
      schema.id,
      schema.userId,
      schema.token,
      schema.expiresAt,
      schema.isUsed,
      schema.createdAt,
      schema.usedAt
    );
  }
}