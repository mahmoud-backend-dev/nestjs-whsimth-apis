import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { GetOneCategoryIdParamDto } from './dto/get-one-category.dto';
import { Query as queryExpress } from 'express-serve-static-core';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add')
  @Roles('admin', 'owner', 'manage category')
  @UseGuards(RolesGuard)
  async createCategory(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ): Promise<object> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('one/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner', 'manage category')
  async getOneCategory(
    @Param() params: GetOneCategoryIdParamDto,
  ): Promise<object> {
    return await this.categoriesService.getOneCategory(params.id);
  }

  @Get('all')
  async getAllCategories(
    @Headers('accept-language')
    lang: string,
    @Query()
    query: queryExpress,
    @Query('category')
    categoryQuery: string,
  ): Promise<object> {
    return await this.categoriesService.getAllCategories(
      lang,
      query,
      categoryQuery,
    );
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner', 'manage category')
  async removeCategory(
    @Param() params: GetOneCategoryIdParamDto,
  ): Promise<object> {
    return await this.categoriesService.removeCategory(params.id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner', 'manage category')
  async updateCategory(
    @Param() params: GetOneCategoryIdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<object> {
    return await this.categoriesService.updateCategory(
      params.id,
      updateCategoryDto,
    );
  }
}
