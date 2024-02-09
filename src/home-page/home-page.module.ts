import { Module } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { HomePageController } from './home-page.controller';

@Module({
  controllers: [HomePageController],
  providers: [HomePageService],
})
export class HomePageModule {}
