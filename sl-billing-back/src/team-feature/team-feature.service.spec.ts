import { Test, TestingModule } from '@nestjs/testing';
import { TeamFeatureService } from './team-feature.service';

describe('TeamFeatureService', () => {
  let service: TeamFeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamFeatureService],
    }).compile();

    service = module.get<TeamFeatureService>(TeamFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
