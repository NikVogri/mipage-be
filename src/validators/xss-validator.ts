import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { IFilterXSSOptions, FilterXSS } from 'xss';

type ValidationOptionsWithWhiteList = ValidationOptions & {
  allowedTags?: IFilterXSSOptions['whiteList'];
};

const validate = (val: string, args: ValidationArguments): boolean => {
  const allowedTags = args.constraints[0] ?? {};

  const xss = new FilterXSS({
    whiteList: allowedTags,
    allowCommentTag: false,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  });

  return xss.process(val) === val;
};

export function IsXssSafe(validationOptions?: ValidationOptionsWithWhiteList) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isXssSafe',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions?.allowedTags],
      validator: {
        validate,
      },
    });
  };
}
