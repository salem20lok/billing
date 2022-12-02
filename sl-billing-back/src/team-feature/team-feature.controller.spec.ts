import { Test, TestingModule } from '@nestjs/testing';
import { TeamFeatureController } from './team-feature.controller';

describe('TeamFeatureController', () => {
  let controller: TeamFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamFeatureController],
    }).compile();

    controller = module.get<TeamFeatureController>(TeamFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
