import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dtos/create-team.dto';
import { PaginationTeamDto } from './dtos/pagination-team.dto';
import { UpdateTeamDto } from './dtos/update-Team.dto';
import { TeamUserService } from '../team-user/team-user.service';
import { TeamFeatureService } from '../team-feature/team-feature.service';
import { PlanFeatureService } from '../plan-feature/plan-feature.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly teamUserService: TeamUserService,
    private readonly teamFeatureService: TeamFeatureService,
    private readonly planFeatureService: PlanFeatureService,
  ) {}

  async createTeam(teamDto: CreateTeamDto): Promise<TeamDocument> {
    const { teamName, users, addFeature } = teamDto;
    const found = await this.teamModel.findOne({ teamName: teamName });
    if (found)
      throw new ConflictException(
        `this team name : ${teamName} is ealready exist  `,
      );

    delete teamDto.users;
    delete teamDto.addFeature;

    try {
      const res = new this.teamModel(teamDto);
      await res.save().then(async (e) => {
        if (users.length) {
          await this.teamUserService.bulkWriteInsertMany(users, e._id);
        }
        if (addFeature.length) {
          await this.teamFeatureService.bulkWriteInsertMany(addFeature, e._id);
        }
      });
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async teamPagination(
    teamPagination: PaginationTeamDto,
  ): Promise<{ count: number; teams: TeamDocument[] }> {
    const { teamName, skip, limit } = teamPagination;

    const query = {};

    if (teamName) {
      Object.assign(query, { $text: { $search: teamName } });
    }

    try {
      const teams = await this.teamModel.find(query).skip(skip).limit(limit);
      const count = await this.teamModel.find(query).count();
      return { count: count, teams: teams };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateTeam(
    id: string,
    updateDto: UpdateTeamDto,
  ): Promise<TeamDocument> {
    const {
      teamName,
      avatar,
      plan,
      teamUserDelete,
      teamUserAdd,
      addFeature,
      deleteFeature,
    } = updateDto;

    const query = {
      teamName: teamName,
      avatar: avatar,
      plan: plan,
    };

    delete updateDto.users;
    delete updateDto.addFeature;
    delete updateDto.deleteFeature;

    if (!teamName) delete query.teamName;
    if (!avatar) delete query.avatar;
    if (!plan) delete query.plan;

    try {
      await this.teamModel.findByIdAndUpdate(id, query).then(async (res) => {
        console.log(teamUserDelete);
        console.log(teamUserAdd);
        if (teamUserDelete) {
          if (teamUserDelete.length) {
            await this.teamUserService.bulkDeleteMany(teamUserDelete, res._id);
          }
        }
        if (teamUserAdd) {
          if (teamUserAdd.length) {
            await this.teamUserService.bulkWriteInsertMany(
              teamUserAdd,
              res._id,
            );
          }
        }

        await this.controleDuplication(query.plan, id);

        if (addFeature.length) {
          await this.teamFeatureService.bulkWriteInsertMany(
            addFeature,
            res._id,
          );
        }
        if (deleteFeature.length) {
          await this.teamFeatureService.bulkDeleteMany(res._id, deleteFeature);
        }
      });
      return await this.teamModel.findById(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getTeamById(id: string): Promise<TeamDocument> {
    return await this.teamModel.findById(id);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.teamModel.findByIdAndDelete(id).then(async (res) => {
      await this.teamUserService.bulkDeleteManyTeamUserAfterDeleteTeam(id);
    });
  }

  async getAllTeams(): Promise<TeamDocument[]> {
    try {
      return await this.teamModel.find({});
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getTeamByPlan(id: string): Promise<TeamDocument> {
    try {
      return await this.teamModel.findOne({ plan: id });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getAllTeamsByPlan(id: string): Promise<TeamDocument[]> {
    try {
      return await this.teamModel.find({ plan: id });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async controleDuplication(plan: string, team: string): Promise<void> {
    try {
      // plan feature
      const planFeature = await this.planFeatureService.getPlanFeature(plan);
      // team feature
      const teamFeature = await this.teamFeatureService.getTeamFeaturesByTeam(
        team,
      );
      const planArray = planFeature.map((el) => {
        return el.feature.toString();
      });
      const teamArray = teamFeature.map((el) => {
        return el.feature.toString();
      });
      const res = teamArray.map((el) => {
        if (planArray.includes(el)) {
          return el;
        }
      });
      await this.teamFeatureService.bulkDeleteMany(team, res);
    } catch (e) {}
  }
}
