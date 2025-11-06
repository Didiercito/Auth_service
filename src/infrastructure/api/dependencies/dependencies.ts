import { AppDataSource } from '../../../config/data-source';

import { UserAdapter } from '../../adapters/user.adapter';
import { EmailVerificationRepository } from '../../adapters/email-verification.adapter';
import { PhoneVerificationRepository } from '../../adapters/phone-verification.adapter';
import { PasswordResetTokenRepository } from '../../adapters/password-reset-token.adapter';
import { RoleRepository } from '../../adapters/role.adapter';
import { PermissionRepository } from '../../adapters/permission.adapter';
import { SkillAdapter } from '../../adapters/skill.adapter';
import { UserSkillAdapter } from '../../adapters/user-skill.adapter';
import { UserAvailabilityAdapter } from '../../adapters/user-availability.adapter';
import { UserScheduleAdapter } from '../../adapters/user-schedule.adapter';
import { UserReputationHistoryAdapter } from '../../adapters/user-reputation-history.adapter';

import { BcryptPasswordHasherService } from '../../../services/bcrypt-password-hasher.service';
import { JwtTokenGeneratorService } from '../../../services/jwt-token-generator.service';
import { RabbitMQEventPublisherService } from '../../../services/rabbitmq-event-publisher.service';

import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';
import { ValidateTokenUseCase } from '../../../application/use-cases/validate-token.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case';

import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';
import { ResendEmailVerificationUseCase } from '../../../application/use-cases/resend-email-verification.use-case';
import { VerifyPhoneUseCase } from '../../../application/use-cases/verify-phone.use-case';
import { ResendPhoneVerificationUseCase } from '../../../application/use-cases/resend-phone-verification.use-case';

import { RequestPasswordResetUseCase } from '../../../application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../../../application/use-cases/reset-password.use-case';

import { AssignRoleUseCase } from '../../../application/use-cases/assign-role.use-case';
import { RemoveRoleUseCase } from '../../../application/use-cases/remove-role.use-case';
import { GetUserPermissionsUseCase } from '../../../application/use-cases/get-user-permissions.use-case';
import { CheckUserPermissionUseCase } from '../../../application/use-cases/check-user-permission.use-case';

import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case';
import { GetUsersPaginatedUseCase } from '../../../application/use-cases/get-users-paginated.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';

import { GetSkillsUseCase } from '../../../application/use-cases/get-skills.use-case';
import { GetUserSkillsUseCase } from '../../../application/use-cases/get-user-skills.use-case';
import { AddUserSkillUseCase } from '../../../application/use-cases/add-user-skill.use-case';
import { RemoveUserSkillUseCase } from '../../../application/use-cases/remove-user-skill.use-case';

import { SetUserAvailabilityUseCase } from '../../../application/use-cases/set-user-availability.use-case';
import { GetUserAvailabilityUseCase } from '../../../application/use-cases/get-user-availability.use-case';
import { CheckUserAvailabilityUseCase } from '../../../application/use-cases/check-user-availability.use-case';

import { CreateUserScheduleUseCase } from '../../../application/use-cases/create-user-schedule.use-case';
import { UpdateUserScheduleUseCase } from '../../../application/use-cases/update-user-schedule.use-case';
import { DeleteUserScheduleUseCase } from '../../../application/use-cases/delete-user-schedule.use-case';
import { GetUserSchedulesUseCase } from '../../../application/use-cases/get-user-schedules.use-case';

import { UpdateUserReputationUseCase } from '../../../application/use-cases/update-user-reputation.use-case';
import { GetUserReputationHistoryUseCase } from '../../../application/use-cases/get-user-reputation-history.use-case';

import { RegisterUserController } from '../controllers/register-user.controller';
import { LoginUserController } from '../controllers/login-user.controller';
import { ValidateTokenController } from '../controllers/validate-token.controller';
import { RefreshTokenController } from '../controllers/refresh-token.controller';

import { VerifyEmailController } from '../controllers/verify-email.controller';
import { ResendEmailVerificationController } from '../controllers/resend-email-verification.controller';
import { VerifyPhoneController } from '../controllers/verify-phone.controller';
import { ResendPhoneVerificationController } from '../controllers/resend-phone-verification.controller';

import { RequestPasswordResetController } from '../controllers/request-password-reset.controller';
import { ResetPasswordController } from '../controllers/reset-password.controller';

import { AssignRoleController } from '../controllers/assign-role.controller';
import { RemoveRoleController } from '../controllers/remove-role.controller';
import { GetUserPermissionsController } from '../controllers/get-user-permissions.controller';
import { CheckUserPermissionController } from '../controllers/check-user-permission.controller';

import { GetUserByIdController } from '../controllers/get-user-by-id.controller';
import { GetUsersPaginatedController } from '../controllers/get-users-paginated.controller';
import { UpdateUserController } from '../controllers/update-user.controller';
import { UpdateProfileController } from '../controllers/update-profile.controller';
import { DeleteUserController } from '../controllers/delete-user.controller';

import { GetSkillsController } from '../controllers/get-skills.controller';
import { GetUserSkillsController } from '../controllers/get-user-skills.controller';
import { AddUserSkillController } from '../controllers/add-user-skill.controller';
import { RemoveUserSkillController } from '../controllers/remove-user-skill.controller';

import { SetUserAvailabilityController } from '../controllers/set-user-availability.controller';
import { GetUserAvailabilityController } from '../controllers/get-user-availability.controller';
import { CheckUserAvailabilityController } from '../controllers/check-user-availability.controller';

import { CreateUserScheduleController } from '../controllers/create-user-schedule.controller';
import { UpdateUserScheduleController } from '../controllers/update-user-schedule.controller';
import { DeleteUserScheduleController } from '../controllers/delete-user-schedule.controller';
import { GetUserSchedulesController } from '../controllers/get-user-schedules.controller';

import { UpdateUserReputationController } from '../controllers/update-user-reputation.controller';
import { GetUserReputationHistoryController } from '../controllers/get-user-reputation-history.controller';

const userRepository = new UserAdapter(AppDataSource);
const emailVerificationRepository = new EmailVerificationRepository();
const phoneVerificationRepository = new PhoneVerificationRepository();
const passwordResetTokenRepository = new PasswordResetTokenRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const skillRepository = new SkillAdapter(AppDataSource);
const userSkillRepository = new UserSkillAdapter(AppDataSource);
const userAvailabilityRepository = new UserAvailabilityAdapter(AppDataSource);
const userScheduleRepository = new UserScheduleAdapter(AppDataSource);
const userReputationHistoryRepository = new UserReputationHistoryAdapter(AppDataSource);

const passwordHasher = new BcryptPasswordHasherService();
const tokenGenerator = new JwtTokenGeneratorService();
const eventPublisher = new RabbitMQEventPublisherService();

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  emailVerificationRepository,
  passwordHasher,
  tokenGenerator,
  eventPublisher
);

const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  roleRepository,
  passwordHasher,
  tokenGenerator
);

const validateTokenUseCase = new ValidateTokenUseCase(
  tokenGenerator,
  userRepository
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  tokenGenerator,
  userRepository,
  roleRepository
);

const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  emailVerificationRepository,
  eventPublisher
);

const resendEmailVerificationUseCase = new ResendEmailVerificationUseCase(
  userRepository,
  emailVerificationRepository,
  tokenGenerator,
  eventPublisher
);

const verifyPhoneUseCase = new VerifyPhoneUseCase(
  userRepository,
  phoneVerificationRepository,
  eventPublisher
);

const resendPhoneVerificationUseCase = new ResendPhoneVerificationUseCase(
  userRepository,
  phoneVerificationRepository,
  tokenGenerator,
  eventPublisher
);

const requestPasswordResetUseCase = new RequestPasswordResetUseCase(
  userRepository,
  passwordResetTokenRepository,
  tokenGenerator,
  eventPublisher
);

const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordResetTokenRepository,
  passwordHasher,
  eventPublisher
);

const assignRoleUseCase = new AssignRoleUseCase(
  userRepository,
  roleRepository,
  eventPublisher
);

const removeRoleUseCase = new RemoveRoleUseCase(
  userRepository,
  roleRepository,
  eventPublisher
);

const getUserPermissionsUseCase = new GetUserPermissionsUseCase(
  permissionRepository
);

const checkUserPermissionUseCase = new CheckUserPermissionUseCase(
  permissionRepository
);

const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

const getUsersPaginatedUseCase = new GetUsersPaginatedUseCase(userRepository);

const updateUserUseCase = new UpdateUserUseCase(userRepository);

const updateProfileUseCase = new UpdateProfileUseCase(userRepository);

const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const getSkillsUseCase = new GetSkillsUseCase(skillRepository);

const getUserSkillsUseCase = new GetUserSkillsUseCase(
  userSkillRepository,
  userRepository
);

const addUserSkillUseCase = new AddUserSkillUseCase(
  userSkillRepository,
  userRepository,
  skillRepository
);

const removeUserSkillUseCase = new RemoveUserSkillUseCase(
  userSkillRepository,
  userRepository
);

const setUserAvailabilityUseCase = new SetUserAvailabilityUseCase(
  userAvailabilityRepository,
  userRepository
);

const getUserAvailabilityUseCase = new GetUserAvailabilityUseCase(
  userAvailabilityRepository,
  userRepository
);

const checkUserAvailabilityUseCase = new CheckUserAvailabilityUseCase(
  userAvailabilityRepository,
  userScheduleRepository,
  userRepository
);

const createUserScheduleUseCase = new CreateUserScheduleUseCase(
  userScheduleRepository,
  userRepository
);

const updateUserScheduleUseCase = new UpdateUserScheduleUseCase(
  userScheduleRepository
);

const deleteUserScheduleUseCase = new DeleteUserScheduleUseCase(
  userScheduleRepository
);

const getUserSchedulesUseCase = new GetUserSchedulesUseCase(
  userScheduleRepository,
  userRepository
);

const updateUserReputationUseCase = new UpdateUserReputationUseCase(
  userRepository,
  userReputationHistoryRepository
);

const getUserReputationHistoryUseCase = new GetUserReputationHistoryUseCase(
  userRepository,
  userReputationHistoryRepository
);

export const registerUserController = new RegisterUserController(registerUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase);
export const validateTokenController = new ValidateTokenController(validateTokenUseCase);
export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

export const verifyEmailController = new VerifyEmailController(verifyEmailUseCase);
export const resendEmailVerificationController = new ResendEmailVerificationController(resendEmailVerificationUseCase);
export const verifyPhoneController = new VerifyPhoneController(verifyPhoneUseCase);
export const resendPhoneVerificationController = new ResendPhoneVerificationController(resendPhoneVerificationUseCase);

export const requestPasswordResetController = new RequestPasswordResetController(requestPasswordResetUseCase);
export const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

export const assignRoleController = new AssignRoleController(assignRoleUseCase);
export const removeRoleController = new RemoveRoleController(removeRoleUseCase);
export const getUserPermissionsController = new GetUserPermissionsController(getUserPermissionsUseCase);
export const checkUserPermissionController = new CheckUserPermissionController(checkUserPermissionUseCase);

export const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
export const getUsersPaginatedController = new GetUsersPaginatedController(getUsersPaginatedUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const updateProfileController = new UpdateProfileController(updateProfileUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);

export const getSkillsController = new GetSkillsController(getSkillsUseCase);
export const getUserSkillsController = new GetUserSkillsController(getUserSkillsUseCase);
export const addUserSkillController = new AddUserSkillController(addUserSkillUseCase);
export const removeUserSkillController = new RemoveUserSkillController(removeUserSkillUseCase);

export const setUserAvailabilityController = new SetUserAvailabilityController(setUserAvailabilityUseCase);
export const getUserAvailabilityController = new GetUserAvailabilityController(getUserAvailabilityUseCase);
export const checkUserAvailabilityController = new CheckUserAvailabilityController(checkUserAvailabilityUseCase);

export const createUserScheduleController = new CreateUserScheduleController(createUserScheduleUseCase);
export const updateUserScheduleController = new UpdateUserScheduleController(updateUserScheduleUseCase);
export const deleteUserScheduleController = new DeleteUserScheduleController(deleteUserScheduleUseCase);
export const getUserSchedulesController = new GetUserSchedulesController(getUserSchedulesUseCase);

export const updateUserReputationController = new UpdateUserReputationController(updateUserReputationUseCase);
export const getUserReputationHistoryController = new GetUserReputationHistoryController(getUserReputationHistoryUseCase);

export { tokenGenerator, eventPublisher };