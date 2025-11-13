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

import { 
  RegisterUserUseCase,
  LoginUserUseCase,
  ValidateTokenUseCase,
  RefreshTokenUseCase,
  VerifyEmailUseCase,
  ResendEmailVerificationUseCase,
  VerifyPhoneUseCase,
  ResendPhoneVerificationUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  AssignRoleUseCase,
  RemoveRoleUseCase,
  GetUserPermissionsUseCase,
  CheckUserPermissionUseCase,
  GetUserByIdUseCase,
  GetUsersPaginatedUseCase,
  UpdateUserUseCase,
  UpdateProfileUseCase,
  DeleteUserUseCase,
  GetSkillsUseCase,
  GetUserSkillsUseCase,
  AddUserSkillUseCase,
  RemoveUserSkillUseCase,
  SetUserAvailabilityUseCase,
  GetUserAvailabilityUseCase,
  CheckUserAvailabilityUseCase,
  CreateUserScheduleUseCase,
  UpdateUserScheduleUseCase,
  DeleteUserScheduleUseCase,
  GetUserSchedulesUseCase,
  UpdateUserReputationUseCase,
  GetUserReputationHistoryUseCase,
  AssignVolunteerRoleUseCase,
  CompleteProfileUseCase,
  RegisterKitchenAdminUseCase
} from '../../../application/use-cases';
import { UpdateUserAvailabilityUseCase } from '../../../application/use-cases/update-user-availability.use-case';
import { GetMyProfileUseCase } from '../../../application/use-cases/get-my-profile.use-case';

import {
  RegisterUserController,
  LoginUserController,
  ValidateTokenController,
  RefreshTokenController,
  VerifyEmailController,
  ResendEmailVerificationController,
  VerifyPhoneController,
  ResendPhoneVerificationController,
  RequestPasswordResetController,
  ResetPasswordController,
  AssignRoleController,
  RemoveRoleController,
  GetUserPermissionsController,
  CheckUserPermissionController,
  GetUserByIdController,
  GetUsersPaginatedController,
  UpdateUserController,
  UpdateProfileController,
  DeleteUserController,
  GetSkillsController,
  GetUserSkillsController,
  AddUserSkillController,
  RemoveUserSkillController,
  SetUserAvailabilityController,
  GetUserAvailabilityController,
  CheckUserAvailabilityController,
  CreateUserScheduleController,
  UpdateUserScheduleController,
  DeleteUserScheduleController,
  GetUserSchedulesController,
  UpdateUserReputationController,
  GetUserReputationHistoryController,
  CompleteProfileController,
  RegisterKitchenAdminController,
  GetMyAvailabilityController
} from '../controllers';
import { UpdateUserAvailabilityController } from '../controllers/update-user-availability.controller';
import { DeleteUserAvailabilityController } from '../controllers/delete-user-availability.controller';
import { GetMyProfileController } from '../controllers/get-my-profile.controller';

const userRepository = new UserAdapter(AppDataSource);
const emailVerificationRepository = new EmailVerificationRepository();
const phoneVerificationRepository = new PhoneVerificationRepository();
const passwordResetTokenRepository = new PasswordResetTokenRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const skillRepository = new SkillAdapter(AppDataSource);
const userSkillRepository = new UserSkillAdapter(AppDataSource);
const userAvailabilityRepository = new UserAvailabilityAdapter();
const userScheduleRepository = new UserScheduleAdapter(AppDataSource);
const userReputationHistoryRepository = new UserReputationHistoryAdapter(AppDataSource);

const passwordHasher = new BcryptPasswordHasherService();
const tokenGenerator = new JwtTokenGeneratorService();
const eventPublisher = new RabbitMQEventPublisherService(); 

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  passwordHasher,
  eventPublisher,
  roleRepository,
  userSkillRepository,
  skillRepository,
  userAvailabilityRepository
);

const registerKitchenAdminUseCase = new RegisterKitchenAdminUseCase(
  userRepository,
  roleRepository,
  eventPublisher
);

const loginUserUseCase = new LoginUserUseCase(
  userRepository,
  roleRepository,
  passwordHasher,
  tokenGenerator
);

const validateTokenUseCase = new ValidateTokenUseCase(tokenGenerator, userRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenGenerator, userRepository, roleRepository);

const verifyEmailUseCase = new VerifyEmailUseCase(userRepository, emailVerificationRepository, eventPublisher);
const resendEmailVerificationUseCase = new ResendEmailVerificationUseCase(userRepository, emailVerificationRepository, tokenGenerator, eventPublisher);
const verifyPhoneUseCase = new VerifyPhoneUseCase(userRepository, phoneVerificationRepository, eventPublisher);
const resendPhoneVerificationUseCase = new ResendPhoneVerificationUseCase(userRepository, phoneVerificationRepository, tokenGenerator, eventPublisher);

const requestPasswordResetUseCase = new RequestPasswordResetUseCase(userRepository, passwordResetTokenRepository, tokenGenerator, eventPublisher);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordResetTokenRepository, passwordHasher, eventPublisher);

const assignRoleUseCase = new AssignRoleUseCase(userRepository, roleRepository, eventPublisher);
const removeRoleUseCase = new RemoveRoleUseCase(userRepository, roleRepository, eventPublisher);
const getUserPermissionsUseCase = new GetUserPermissionsUseCase(permissionRepository);
const checkUserPermissionUseCase = new CheckUserPermissionUseCase(permissionRepository);

const getSkillsUseCase = new GetSkillsUseCase(skillRepository);
const getUserSkillsUseCase = new GetUserSkillsUseCase(userSkillRepository, userRepository);
const addUserSkillUseCase = new AddUserSkillUseCase(userSkillRepository, userRepository, skillRepository);
const removeUserSkillUseCase = new RemoveUserSkillUseCase(userSkillRepository, userRepository);

const setUserAvailabilityUseCase = new SetUserAvailabilityUseCase(userAvailabilityRepository, userRepository);
const updateUserAvailabilityUseCase = new UpdateUserAvailabilityUseCase(userAvailabilityRepository, userRepository);
const getUserAvailabilityUseCase = new GetUserAvailabilityUseCase(userAvailabilityRepository, userRepository);
const checkUserAvailabilityUseCase = new CheckUserAvailabilityUseCase(userAvailabilityRepository, userScheduleRepository, userRepository);

const createUserScheduleUseCase = new CreateUserScheduleUseCase(userScheduleRepository, userRepository);
const updateUserScheduleUseCase = new UpdateUserScheduleUseCase(userScheduleRepository);
const deleteUserScheduleUseCase = new DeleteUserScheduleUseCase(userScheduleRepository);
const getUserSchedulesUseCase = new GetUserSchedulesUseCase(userScheduleRepository, userRepository);

const updateUserReputationUseCase = new UpdateUserReputationUseCase(userRepository, userReputationHistoryRepository);
const getUserReputationHistoryUseCase = new GetUserReputationHistoryUseCase(userRepository, userReputationHistoryRepository);

const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
const completeProfileUseCase = new CompleteProfileUseCase(
  userRepository,
  userSkillRepository,
  skillRepository,
  new AssignVolunteerRoleUseCase(userRepository, roleRepository)
);
const getMyProfileUseCase = new GetMyProfileUseCase(userRepository, userSkillRepository, userAvailabilityRepository);

export const registerUserController = new RegisterUserController(registerUserUseCase);
export const registerKitchenAdminController = new RegisterKitchenAdminController(registerKitchenAdminUseCase);
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
export const getUserByIdController = new GetUserByIdController(new GetUserByIdUseCase(userRepository));
export const getUsersPaginatedController = new GetUsersPaginatedController(new GetUsersPaginatedUseCase(userRepository));
export const updateUserController = new UpdateUserController(new UpdateUserUseCase(userRepository));
export const updateProfileController = new UpdateProfileController(updateProfileUseCase);
export const deleteUserController = new DeleteUserController(new DeleteUserUseCase(userRepository));
export const getSkillsController = new GetSkillsController(getSkillsUseCase);
export const getUserSkillsController = new GetUserSkillsController(getUserSkillsUseCase);
export const addUserSkillController = new AddUserSkillController(addUserSkillUseCase);
export const removeUserSkillController = new RemoveUserSkillController(removeUserSkillUseCase);
export const setUserAvailabilityController = new SetUserAvailabilityController(setUserAvailabilityUseCase);
export const updateUserAvailabilityController = new UpdateUserAvailabilityController(updateUserAvailabilityUseCase);
export const deleteUserAvailabilityController = new DeleteUserAvailabilityController(userAvailabilityRepository);
export const getUserAvailabilityController = new GetUserAvailabilityController(getUserAvailabilityUseCase);
export const checkUserAvailabilityController = new CheckUserAvailabilityController(checkUserAvailabilityUseCase);
export const createUserScheduleController = new CreateUserScheduleController(createUserScheduleUseCase);
export const updateUserScheduleController = new UpdateUserScheduleController(updateUserScheduleUseCase);
export const deleteUserScheduleController = new DeleteUserScheduleController(deleteUserScheduleUseCase);
export const getUserSchedulesController = new GetUserSchedulesController(getUserSchedulesUseCase);
export const updateUserReputationController = new UpdateUserReputationController(updateUserReputationUseCase);
export const getUserReputationHistoryController = new GetUserReputationHistoryController(getUserReputationHistoryUseCase);
export const completeProfileController = new CompleteProfileController(completeProfileUseCase);
export const getMyProfileController = new GetMyProfileController(getMyProfileUseCase);
export const getMyAvailabilityController = new GetMyAvailabilityController(getUserAvailabilityUseCase); // <--- Agregar

export { tokenGenerator, eventPublisher };
