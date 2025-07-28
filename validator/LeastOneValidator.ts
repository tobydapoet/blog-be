import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOneField(
  propertyNames: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: propertyNames,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const [fields] = args.constraints;
          return fields.some((field: string) => !!args.object[field]);
        },
        defaultMessage(args: ValidationArguments) {
          return `At least 1 object get value: ${args.constraints[0].join(', ')}`;
        },
      },
    });
  };
}
