import { Request, Response } from 'express';
import { AddUserSkillUseCase } from '../../../application/use-cases/add-user-skill.use-case';

export class AddUserSkillController {
  constructor(private readonly addUserSkillUseCase: AddUserSkillUseCase) { }

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const skillId = parseInt(req.body.skillId);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found'
        });
        return;
      }

      if (isNaN(skillId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid or missing skillId'
        });
        return;
      }
      
      const dto = {
        userId: userId,
        skillId: skillId,
        proficiencyLevel: req.body.proficiencyLevel ? parseInt(req.body.proficiencyLevel) : undefined,
        yearsOfExperience: req.body.yearsOfExperience ? parseInt(req.body.yearsOfExperience) : undefined,
      };

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