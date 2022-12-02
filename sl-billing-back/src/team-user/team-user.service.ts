import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TeamUser, TeamUserDocument } from './schemas/teamUser.schema';
import { Model } from 'mongoose';
import { CreateTeamUserDto } from './dtos/create-teamUser.dto';
import { PaginationTeamUserDto } from './dtos/pagination-teamUser.dto';
import { UpdateTeamUserDto } from './dtos/update-teamUser.dto';

@Injectable()
export class TeamUserService {
  constructor(
    @InjectModel(TeamUser.name) private teamUserModel: Model<TeamUserDocument>,
  ) {}

  async createTeamUser(
    teamUserDto: CreateTeamUserDto,
  ): Promise<TeamUserDocument> {
    const { user, team } = teamUserDto;

    const found = await this.teamUserModel.findOne({ user, team });

    if (found) throw new ConflictException(` this userTeam is already exist `);

    try {
      const teamUser = new this.teamUserModel(teamUserDto);
      await teamUser.save();
      return teamUser;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async paginationTeamUser(
    teamUserPagination: PaginationTeamUserDto,
  ): Promise<{ count: number; teamUsers: TeamUserDocument[] }> {
    const { skip, limit } = teamUserPagination;
    try {
      const teamUsers = await this.teamUserModel
        .find({})
        .skip(skip)
        .limit(limit);
      const count = await this.teamUserModel.find({}).count();
      return { count, teamUsers };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getTeamUserById(id: string): Promise<TeamUserDocument> {
    return await this.teamUserModel.findById(id);
  }

  async updateTeamUser(
    id: string,
    updateDto: UpdateTeamUserDto,
  ): Promise<TeamUserDocument> {
    const { team, user } = updateDto;
    const query = {
      team: team,
      user: user,
    };

    if (!team) delete query.team;
    if (!user) delete query.user;

    try {
      await this.teamUserModel.findByIdAndUpdate(id, query);
      return this.teamUserModel.findById(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async deleteTeamUser(id: string): Promise<void> {
    try {
      await this.teamUserModel.findByIdAndDelete(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async bulkWriteInsertMany(users: string[], team: string): Promise<void> {
    const bulk = users.map((el) => {
      return {
        insertOne: { document: { user: el, team: team } },
      };
    });
    await this.teamUserModel.bulkWrite(bulk);
  }

  async bulkDeleteMany(teamUser: string[], team: string): Promise<void> {
    const bulk = teamUser.map((el) => {
      return { deleteMany: { filter: { team: team, user: el } } };
    });
    await this.teamUserModel.bulkWrite(bulk);
  }

  async bulkWriteInsertManyTeamUserByUser(
    user: string,
    teams: string[],
  ): Promise<void> {
    const bulk = teams.map((el) => {
      return {
        insertOne: { document: { user: user, team: el } },
      };
    });
    await this.teamUserModel.bulkWrite(bulk);
  }

  async bulkDeleteManyByUser(
    teamsDelete: string[],
    user: string,
  ): Promise<void> {
    const bulk = teamsDelete.map((el) => {
      return {
        deleteMany: { filter: { user: user, team: el } },
      };
    });

    await this.teamUserModel.bulkWrite(bulk);
  }

  async getTeamUserByTeam(id: string): Promise<TeamUserDocument[]> {
    try {
      const res = await this.teamUserModel
        .find({ team: id })
        .populate(['user', 'team']);
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getTeamUserByUser(id: string): Promise<TeamUserDocument[]> {
    try {
      const res = await this.teamUserModel
        .find({ user: id })
        .populate(['user', 'team']);
      return res;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async bulkDeleteManyTeamUserAfterDeleteTeam(team: string): Promise<void> {
    await this.teamUserModel.bulkWrite([
      {
        deleteMany: { filter: { team: team } },
      },
    ]);
  }
}
