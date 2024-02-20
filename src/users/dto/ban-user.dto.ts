import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { IsUserNotExist } from '../validation/user-not-exist.rule';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Validate the date format DD/MM/YYYY
          const regex = /^\d{2}\/\d{2}\/\d{4}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format DD/MM/YYYY.`;
        },
      },
    });
  };
}

export class BanUserParamIdDto {
  @IsUserNotExist()
  id: string;
}

export class BanUserBodyDto {
  @IsDateFormat()
  date: Date;
}

export class BanUserForeverParamIdDto {
  @IsUserNotExist()
  id: string;
}
