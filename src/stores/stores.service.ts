import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Store } from './schema/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreBodyDto } from './dto/update-store.dto';
import { unlink } from 'fs/promises';
import { Product } from 'src/products/schema/product.schema';
import { paginate } from 'src/utils/pagination';
import { Query } from 'express-serve-static-core';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<Store>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async createStore(
    createStoreDto: CreateStoreDto,
    file: Express.Multer.File,
  ): Promise<object> {
    const image = `${process.env.BASE_URL}/uploads/${file.filename}`;
    const store = await this.storeModel.create({ ...createStoreDto, image });
    return {
      status: 'success',
      message: 'store created successfully',
      store,
    };
  }

  async updateStore(
    id: string,
    file: Express.Multer.File,
    updateStoreBodyDto: UpdateStoreBodyDto,
  ): Promise<object> {
    const store = await this.storeModel.findById(id);
    if (file) {
      const image = `${process.env.BASE_URL}/uploads/${file.filename}`;
      await unlink(`src/stores/uploads/${store.image.split('/').pop()}`);
      store.image = image;
    }
    if (updateStoreBodyDto.name) store.name = updateStoreBodyDto.name;
    if (updateStoreBodyDto.region) store.region = updateStoreBodyDto.region;
    if (updateStoreBodyDto.city) store.city = updateStoreBodyDto.city;
    await store.save();
    return {
      status: 'success',
      message: 'store updated successfully',
      store,
    };
  }

  async getOneStore(id: string): Promise<object> {
    const store = await this.storeModel.findById(id);
    return {
      status: 'success',
      store,
    };
  }

  async removeStore(id: string): Promise<object> {
    const store = await this.storeModel.findByIdAndUpdate(id, {
      isArchive: true,
    });
    await unlink(`src/stores/uploads/${store.image.split('/').pop()}`);
    const products = await this.productModel.find({
      'stores.store': store._id,
    });
    for (const product of products) {
      product.stores = product.stores.filter(
        (store) => store.store.toString() !== id.toString(),
      );
      await product.save();
    }
    return {
      status: 'success',
      message: 'store deleted successfully',
    };
  }

  async getAllStores(
    lang: string,
    storeQuery: string,
    query: Query,
  ): Promise<object> {
    lang = lang !== ('ar' || 'en') ? 'en' : lang;
    const regexPatternStore = storeQuery ? new RegExp(storeQuery, 'i') : /.*/;
    const { limit, pagination, skip } = await paginate(this.storeModel, query);
    const stores = await this.storeModel
      .find({
        isArchive: false,
        $or: [
          { 'name.ar': { $regex: regexPatternStore } },
          { 'name.en': { $regex: regexPatternStore } },
        ],
      })
      .skip(skip)
      .limit(limit)
      .select(`name.${lang} region.${lang} city.${lang} image`);
    return {
      status: 'success',
      count: stores.length,
      pagination,
      stores,
    };
  }
}
