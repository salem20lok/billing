import { Test, TestingModule } from '@nestjs/testing';
import { PlanFeatureController } from './plan-feature.controller';

describe('PlanFeatureController', () => {
  let controller: PlanFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanFeatureController],
    }).compile();

    controller = module.get<PlanFeatureController>(PlanFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
