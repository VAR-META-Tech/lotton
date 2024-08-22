import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsFeatured(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFeatured',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments): boolean {
          const date = new Date(value);
          return date.getTime() - new Date().getTime() > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a feature time`;
        },
      },
    });
  };
}
