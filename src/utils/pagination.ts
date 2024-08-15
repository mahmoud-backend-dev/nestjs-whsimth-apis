import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

interface PaginationParams {
  limit: number;
  page: number;
}

@Injectable()
export class PaginationService {
  async paginate(model: Model<any>, params: PaginationParams) {
    const { limit = 10, page = 1 } = params;
    const skip = (page - 1) * limit;
    const countDocuments = await model.countDocuments();
    const endIndex = page * limit;
    const pagination = {
      totalPages: Math.ceil(countDocuments / limit),
      currentPage: page,
    };

    if (endIndex < countDocuments) pagination['next'] = page + 1;
    if (skip > 0) pagination['prev'] = page - 1;

    return {
      pagination,
      skip,
      limit,
    };
  }
}