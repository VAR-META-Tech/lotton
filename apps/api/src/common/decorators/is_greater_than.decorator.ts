import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsGreaterThan(
  value: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(val: any, _args: ValidationArguments): boolean {
          return Number(val) > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than ${value}`;
        },
      },
    });
  };
}
