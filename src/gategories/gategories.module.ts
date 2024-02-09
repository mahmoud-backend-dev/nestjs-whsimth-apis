import { Module } from '@nestjs/common';
import { GategoriesService } from './gategories.service';
import { GategoriesController } from './gategories.controller';

@Module({
  controllers: [GategoriesController],
  providers: [GategoriesService],
})
export class GategoriesModule {}
