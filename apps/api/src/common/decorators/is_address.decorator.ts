import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

function isValidTONAddress(address: any) {
  if (typeof address !== 'string' || address.length !== 66) return false;

  if (!address.startsWith('0:')) return false;

  const hexPattern = /^[0-9a-fA-F]{64}$/;
  return hexPattern.test(address.slice(2));
}

export function IsAddress(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return isValidTONAddress(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid wallet address`;
        },
      },
    });
  };
}
