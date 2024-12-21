import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddMainSectionDto } from './dto/add-main-section.dto';
import { UpdateMainSectionDto } from './dto/update-main-section.dto';
import { setStorage } from './utils/setStorage';
import { AddSectionOneDto } from './dto/add-section-one.dto';
import { AddSectionTwoDto } from './dto/add-section-two.dto';

@Controller({
  path: 'home-page',
  version: '1',
})
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  @Post('add/main-section')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage home setting')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: setStorage('main-section'),
    }),
  )
  async addMainSection(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ fileIsRequired: false }),
    )
    image: Express.Multer.File,
    @Body() addMainSectionDto: AddMainSectionDto,
  ): Promise<object> {
    return await this.homePageService.addMainSection(addMainSectionDto, image);
  }

  @Patch('update/main-section')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage home setting')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: setStorage('main-section'),
    }),
  )
  async updateMainSection(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ fileIsRequired: false }),
    )
    image: Express.Multer.File,
    @Body() updateMainSectionDto: UpdateMainSectionDto,
  ): Promise<object> {
    return await this.homePageService.updateMainSection(
      updateMainSectionDto,
      image,
    );
  }

  @Get('main-section')
  async getMainSection() {
    await this.homePageService.getMainSection();
  }

  @Post('add/section-one')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage home setting')
  async addSectionOne(
    @Body()
    addSectionOne: AddSectionOneDto,
  ): Promise<object> {
    return await this.homePageService.addSectionOne(addSectionOne);
  }

  @Get('section-one')
  async getSectionOne(): Promise<object> {
    return await this.homePageService.getSectionOne();
  }

  @Post('add/section-two')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin', 'manage home setting')
  @UseInterceptors(
    FilesInterceptor('images', undefined, {
      storage: setStorage('section-two'),
    }),
  )
  async addSectionTwo(
    @Body()
    addSectionTwo: AddSectionTwoDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<object> {
    return await this.homePageService.addSectionTwo(addSectionTwo, files);
  }
}
