import { Controller } from '@nestjs/common';
import { HomePageService } from './home-page.service';

@Controller('home-page')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}
}
