import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { paginate } from 'src/utils/pagination';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<object> {
    const category = await this.categoryModel.create(createCategoryDto);
    return {
      status: 'success',
      message: 'category created successfully',
      category,
    };
  }

  async getOneCategory(id: string): Promise<object> {
    const category = await this.categoryModel.findById(id);
    return {
      status: 'success',
      message: 'category found',
      category,
    };
  }

  async getAllCategories(
    lang: string,
    query: Query,
    categoryQuery: string,
  ): Promise<object> {
    lang !== 'ar' || 'en' ? 'en' : lang;
    const { limit, pagination, skip } = await paginate(
      this.categoryModel,
      query,
    );
    const regexPatternCategory = categoryQuery
      ? new RegExp(categoryQuery, 'i')
      : /.*/;
    const categories = await this.categoryModel
      .find({
        isArchive: false,
        $or: [
          { 'name.ar': { $regex: regexPatternCategory } },
          { 'name.en': { $regex: regexPatternCategory } },
        ],
      })
      .limit(limit)
      .skip(skip)
      .select(`name.${lang}`);
    return {
      status: 'success',
      count: categories.length,
      pagination,
      categories,
    };
  }

  async removeCategory(id: string): Promise<object> {
    await this.categoryModel.findByIdAndUpdate(id, {
      isArchive: true,
    });
    return {
      status: 'success',
      message: 'category deleted successfully',
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<object> {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true },
    );
    return {
      status: 'success',
      message: 'category updated successfully',
      category,
    };
  }
}
