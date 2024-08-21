import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function SumValueArray<T>(
  key: keyof T,
  sum: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'SumValueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments): boolean {
          if (!Array.isArray(value)) {
            return false;
          }

          return value.reduce((n, item) => n + item[key], 0) === sum;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be total ${String(key)} is ${sum}`;
        },
      },
    });
  };
}
