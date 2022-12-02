import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { Model } from 'mongoose';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { PaginationPlanDto } from './dtos/pagination-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { TeamService } from '../team/team.service';
import { PlanFeatureService } from '../plan-feature/plan-feature.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    private teamService: TeamService,
    private planFeatureService: PlanFeatureService,
  ) {}

  async createPlan(planDto: CreatePlanDto): Promise<PlanDocument> {
    const { planName, addFeature } = planDto;

    const found = await this.planModel.findOne({ planName: planName });

    if (found)
      throw new ConflictException(
        `this plan name :${planName} is already exist `,
      );

    delete planDto.addFeature;

    try {
      const plan = new this.planModel(planDto);
      await plan.save().then(async (res) => {
        await this.planFeatureService.bulkWriteInsertMany(res._id, addFeature);
      });
      return plan;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async planPagination(
    paginationDto: PaginationPlanDto,
  ): Promise<{ count: number; plans: PlanDocument[] }> {
    const { planName, skip, limit } = paginationDto;
    const query = {};

    if (planName) {
      Object.assign(query, { $text: { $search: planName } });
    }
    try {
      const plans = await this.planModel.find(query).limit(limit).skip(skip);
      const count = await this.planModel.find(query).count();
      return { count, plans };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updatePlan(id: string, planDto: UpdatePlanDto): Promise<PlanDocument> {
    const { planName, deleteFeature, addFeature } = planDto;

    const query = {
      planName: planName,
    };

    if (!planName) delete query.planName;

    delete planDto.addFeature;
    delete planDto.deleteFeature;

    try {
      await this.planModel.findByIdAndUpdate(id, query).then(async (res) => {
        await this.planFeatureService.bulkDeleteMany(deleteFeature, res._id);
        await this.planFeatureService.bulkWriteInsertMany(res._id, addFeature);

        // controlled teamFeature after update feature plan
        const teams = await this.teamService.getAllTeamsByPlan(res._id);
        for (let i = 0; i < teams.length; i++) {
          await this.teamService.controleDuplication(res._id, teams[i]._id);
        }
      });
      return this.planModel.findById(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getPlanById(id: string): Promise<PlanDocument> {
    try {
      return await this.planModel.findById(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deletePlan(id: string): Promise<void> {
    const found = await this.teamService.getTeamByPlan(id);
    if (found) throw new ConflictException(`this plan is include in team `);

    try {
      await this.planModel.findByIdAndDelete(id).then(async (res) => {
        await this.planFeatureService.bulkDeleteManyByPlan(id);
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getAllPlan(): Promise<PlanDocument[]> {
    try {
      return await this.planModel.find({});
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
