import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isMongoId, registerDecorator } from "class-validator";
import { Model } from "mongoose";
import { Product } from "src/products/schema/product.schema";

@Injectable()
@ValidatorConstraint({ async: true })
export class ProductExistOrNotConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) { }
  
  async validate(products: string[], args: ValidationArguments): Promise<boolean> {
    for (const id of products) {
      if (!isMongoId(id)) {
        return false;
      }
    }
    const arrOfProd:Product[] = await Promise.all(products.map((prod) => {
      return this.productModel.findById(prod)
    }))
    if (arrOfProd.some((prod) => !prod)) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    return `Products is valid array of id and must be exits`
  }
}

export function ProductExistOrNot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductExistOrNotConstraint,
    });
  }
}