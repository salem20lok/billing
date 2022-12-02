import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TeamFeature, TeamFeatureDocument } from './schemas/teamFeature.schema';
import { Model } from 'mongoose';
import { CreateTeamFeatureDto } from './dtos/create-teamFeature.dto';
import { PaginationTeamFeatureDto } from './dtos/pagination-teamFeature.dto';
import { UpdateTeamFeatureDto } from './dtos/update-teamFeature.dto';

@Injectable()
export class TeamFeatureService {
  constructor(
    @InjectModel(TeamFeature.name)
    private teamFeatureModel: Model<TeamFeatureDocument>,
  ) {}

  async createTeamFeature(
    createDTo: CreateTeamFeatureDto,
  ): Promise<TeamFeatureDocument> {
    const { feature, team } = createDTo;

    const found = await this.teamFeatureModel.findOne({
      team: team,
      feature: feature,
    });

    if (found) throw new ConflictException();

    try {
      const res = new this.teamFeatureModel(createDTo);
      await res.save();
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async teamFeaturePagination(
    paginationDto: PaginationTeamFeatureDto,
  ): Promise<{
    count: number;
    teamFeatures: TeamFeatureDocument[];
  }> {
    const { skip, limit } = paginationDto;
    try {
      const teamFeatures = await this.teamFeatureModel
        .find({})
        .populate(['team', 'feature'])
        .skip(skip)
        .limit(limit);
      const count = await this.teamFeatureModel.find({}).count();
      return { count, teamFeatures };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateTeamFeature(
    id: string,
    updateDto: UpdateTeamFeatureDto,
  ): Promise<TeamFeatureDocument> {
    const { team, feature } = updateDto;

    const query = {
      feature: feature,
      team: team,
    };

    if (!team) delete query.team;
    if (!feature) delete query.feature;

    try {
      await this.teamFeatureModel.findByIdAndUpdate(id, query);
      const res = await this.teamFeatureModel
        .findById(id)
        .populate(['team', 'feature']);
      return res;
    } catch (e) {
      throw new ConflictException();
    }
  }

  async deleteTeamFeature(id: string): Promise<void> {
    try {
      await this.teamFeatureModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getTeamFeaturesByTeam(id: string): Promise<TeamFeatureDocument[]> {
    try {
      return await this.teamFeatureModel.find({ team: id });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async bulkDeleteMany(team: string, feature: string[]): Promise<void> {
    const bulk = feature.map((el) => {
      return { deleteMany: { filter: { team: team, feature: el } } };
    });
    await this.teamFeatureModel.bulkWrite(bulk).then((e) => {
      console.log(e);
    });
  }

  async bulkWriteInsertMany(feature: string[], team: string): Promise<void> {
    const bulk = feature.map((el) => {
      return {
        insertOne: { document: { feature: el, team: team } },
      };
    });
    await this.teamFeatureModel.bulkWrite(bulk);
  }
}
