import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Store } from './schema/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreBodyDto } from './dto/update-store.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<Store>,
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

  // async deleteStore(id: string): Promise<object> {
  //   const store = await this.storeModel.findByIdAndUpdate(id, {
  //     isArchive: true,
  //   });
  //   await unlink(`src/stores/uploads/${store.image.split('/').pop()}`);
  //   await 
  // }
}
