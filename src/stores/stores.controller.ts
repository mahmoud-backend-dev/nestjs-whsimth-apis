import {
  BadRequestException,
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStoreDto } from './dtos/create-store.dto';

@Controller({
  path: 'stores',
  version: '1',
})
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage store', 'user')
  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  async creteStore(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({
          fileIsRequired: true,
          exceptionFactory: () =>
            new BadRequestException('image is required and must be an image'),
        }),
    )
    file: Express.Multer.File,
    @Body()
    createStoreDto: CreateStoreDto,
  ): Promise<object> {
    return await this.storesService.createStore(createStoreDto, file);
  }
}
