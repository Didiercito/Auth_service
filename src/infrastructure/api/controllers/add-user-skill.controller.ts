import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AddUserSkillUseCase } from '../../../application/use-cases/add-user-skill.use-case';
import { AddSkillDto } from '../../../application/dtos/add-skill.dto';

export class AddUserSkillController {
  constructor(private readonly addUserSkillUseCase: AddUserSkillUseCase) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found'
        });
        return;
      }

      const dto = new AddSkillDto(
        userId,
        req.body.skillId,
        req.body.proficiencyLevel,
        req.body.yearsOfExperience
      );

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const userSkill = await this.addUserSkillUseCase.execute(dto);

      res.status(201).json({
        success: true,
        message: 'Skill added successfully',
        data: userSkill
      });
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || 'Error adding skill',
        ...(error.validations && { validations: error.validations }) 
      });
    }
  };
}