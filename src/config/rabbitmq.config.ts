import { config } from 'dotenv';
config();

export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || '',
  exchange: process.env.RABBITMQ_EXCHANGE || 'auth_events',
  exchangeType: 'topic' as const,

  queues: {
    auth: process.env.RABBITMQ_QUEUE_AUTH || 'auth_user_queue',
    emailVerification: 'email_verification_queue',
    phoneVerification: 'phone_verification_queue',
    passwordReset: 'password_reset_queue',
  },

  routingKeys: {
    userRegistered:
      process.env.RABBITMQ_ROUTINGKEY_USER_REGISTERED || 'user.registered',

    userEmailVerified:
      process.env.RABBITMQ_ROUTINGKEY_EMAIL_VERIFIED || 'user.email.verified',

    userPhoneVerified:
      process.env.RABBITMQ_ROUTINGKEY_PHONE_VERIFIED || 'user.phone.verified',

    passwordResetRequested:
      process.env.RABBITMQ_ROUTINGKEY_PASSWORD_RESET_REQUESTED ||
      'user.password.reset.requested',

    passwordResetCompleted:
      process.env.RABBITMQ_ROUTINGKEY_PASSWORD_RESET_COMPLETED ||
      'user.password.reset.completed',

    roleAssigned:
      process.env.RABBITMQ_ROUTINGKEY_ROLE_ASSIGNED || 'user.role.assigned',

    roleRemoved:
      process.env.RABBITMQ_ROUTINGKEY_ROLE_REMOVED || 'user.role.removed',

    kitchenAdminRegistered:
      process.env.RABBITMQ_ROUTINGKEY_KITCHEN_ADMIN_REGISTERED ||
      'kitchen.admin.registered',

    kitchenAdminUserSynced:
      process.env.RABBITMQ_ROUTINGKEY_KITCHEN_ADMIN_USER_SYNCED ||
      'kitchen.admin.userId.synced',

      userDeleted: process.env.RABBITMQ_ROUTINGKEY_USER_DELETED || 'user.deleted',
  },

  options: {
    durable: true,
    persistent: true,
    prefetch: 10,
  },
};