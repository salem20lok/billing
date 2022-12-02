import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feature, FeatureDocument } from './schemas/feature.schema';
import { Model } from 'mongoose';
import { CreateFeatureDto } from './dtos/create-feature.dto';
import { PaginationFeatureDto } from './dtos/pagination-feature.dto';
import { UpdateFeatureDto } from './dtos/update-feature.dto';
import { PlanFeatureService } from '../plan-feature/plan-feature.service';

@Injectable()
export class FeatureService {
  constructor(
    @InjectModel(Feature.name) private featureModel: Model<FeatureDocument>,
    private planFeatureService: PlanFeatureService,
  ) {}

  async createFeature(
    createFeatureDto: CreateFeatureDto,
  ): Promise<FeatureDocument> {
    const { featureName, plans } = createFeatureDto;
    const found = await this.featureModel.findOne({ featureName: featureName });
    if (found)
      throw new ConflictException(
        `this feature name : ${featureName} is already exist`,
      );

    console.log('plans', plans);

    delete createFeatureDto.plans;

    try {
      const res = new this.featureModel(createFeatureDto);
      await res.save().then(async (res) => {
        if (plans) {
          if (plans.length) {
            await this.planFeatureService.bulkWriteInsertManyByPlans(
              plans,
              res._id,
            );
          }
        }
      });
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async featurePagination(pagination: PaginationFeatureDto): Promise<{
    count: number;
    features: FeatureDocument[];
  }> {
    const { featureName, skip, limit } = pagination;
    const query = {};

    if (featureName) {
      Object.assign(query, { $text: { $search: featureName } });
    }

    try {
      const features = await this.featureModel
        .find(query)
        .skip(skip)
        .limit(limit);
      const count = await this.featureModel.find(query).count();
      return { count, features };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getFeatureById(id: string): Promise<FeatureDocument> {
    try {
      const res = await this.featureModel.findById(id);
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateFeature(
    id: string,
    updateDto: UpdateFeatureDto,
  ): Promise<FeatureDocument> {
    const { featureName } = updateDto;

    const query = {};
    if (featureName) {
      Object.assign(query, {
        featureName: featureName,
      });
    }

    try {
      await this.featureModel.findByIdAndUpdate(id, query);
      const res = await this.featureModel.findById(id);
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deleteFeature(id: string): Promise<void> {
    try {
      await this.featureModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
