import { Test, TestingModule } from '@nestjs/testing';
import { TeamUserController } from './team-user.controller';

describe('TeamUserController', () => {
  let controller: TeamUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamUserController],
    }).compile();

    controller = module.get<TeamUserController>(TeamUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
