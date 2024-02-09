import { Controller } from '@nestjs/common';
import { GategoriesService } from './gategories.service';

@Controller('gategories')
export class GategoriesController {
  constructor(private readonly gategoriesService: GategoriesService) {}
}
