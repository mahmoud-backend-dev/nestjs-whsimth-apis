import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Store } from './schema/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<Store>
  ) { }

  async createStore(createStoreDto: CreateStoreDto, file: Express.Multer.File): Promise<object>{
    const image = `${process.env.BASE_URL}/uploads/${file.filename}`;
    const store = await this.storeModel.create({ ...createStoreDto, image });
    return {
      status: "success",
      message: "store created successfully",
      store
    }
  }
}
