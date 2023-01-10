import { Test, TestingModule } from '@nestjs/testing';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

describe('HolidaysController', () => {
  let controller: HolidaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [HolidaysService],
    }).compile();

    controller = module.get<HolidaysController>(HolidaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
