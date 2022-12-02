import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlanFeature, PlanFeatureDocument } from './schemas/featurePlan.schema';
import { Model } from 'mongoose';
import { CreatePlanFeatureDto } from './dtos/create-planFeature.dto';
import { UpdatePlanFeatureDto } from './dtos/update-planFeature.dto';

@Injectable()
export class PlanFeatureService {
  constructor(
    @InjectModel(PlanFeature.name)
    private planFeatureModel: Model<PlanFeatureDocument>,
  ) {}

  async createPlanFeature(
    createDto: CreatePlanFeatureDto,
  ): Promise<PlanFeatureDocument> {
    const { plan, feature } = createDto;
    const found = await this.planFeatureModel.findOne({ plan, feature });
    if (found)
      throw new ConflictException(` this planFeature is already exist `);

    try {
      const res = new this.planFeatureModel(createDto);
      await res.save();
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getAllPlanFeature(): Promise<PlanFeatureDocument[]> {
    try {
      return await this.planFeatureModel.find({});
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updatePlanFeature(
    id: string,
    updateDto: UpdatePlanFeatureDto,
  ): Promise<PlanFeatureDocument> {
    const { feature, plan } = updateDto;
    const query = {
      plan: plan,
      feature: feature,
    };

    if (!plan) delete query.plan;
    if (!feature) delete query.feature;

    try {
      await this.planFeatureModel.findByIdAndUpdate(id, query);
      const res = await this.planFeatureModel.findById(id);
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deletePlanFeature(id: string): Promise<void> {
    try {
      await this.planFeatureModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async bulkWriteInsertMany(plan: string, feature: string[]): Promise<void> {
    const bulk = feature.map((el) => {
      return {
        insertOne: { document: { feature: el, plan: plan } },
      };
    });
    await this.planFeatureModel.bulkWrite(bulk);
  }

  async bulkWriteInsertManyByPlans(
    plans: string[],
    feature: string,
  ): Promise<void> {
    const bulk = plans.map((el) => {
      return {
        insertOne: { document: { plan: el, feature: feature } },
      };
    });

    await this.planFeatureModel.bulkWrite(bulk);
  }

  async bulkDeleteMany(feature: string[], plan: string): Promise<void> {
    const bulk = feature.map((el) => {
      return {
        deleteMany: { filter: { plan: plan, feature: el } },
      };
    });

    await this.planFeatureModel.bulkWrite(bulk);
  }

  async bulkDeleteManyByPlan(plan: string): Promise<void> {
    await this.planFeatureModel.bulkWrite([
      {
        deleteMany: { filter: { plan: plan } },
      },
    ]);
  }

  async getPlanFeatureByPlan(id: string): Promise<PlanFeatureDocument[]> {
    try {
      return await this.planFeatureModel
        .find({ plan: id })
        .populate(['plan', 'feature']);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getPlanFeature(id: string): Promise<PlanFeatureDocument[]> {
    try {
      return await this.planFeatureModel.find({ plan: id });
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
