import { Query } from 'express-serve-static-core';
import { Model } from 'mongoose';

export const paginate = async (model: Model<any>, query: Query) => {

  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const skip = (page - 1) * limit;
  const countDocuments = await model.countDocuments();
  const endIndex = page * limit;
  const pagination = {};
  pagination['totalPages'] = Math.ceil(countDocuments / limit);
  pagination['currentPage'] = page;

  if (endIndex < countDocuments) pagination['next'] = page + 1;
  if (skip > 0) pagination['prev'] = page - 1;

  return {
    pagination,
    skip,
    limit,
  };
};
