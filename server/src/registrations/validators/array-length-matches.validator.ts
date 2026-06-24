import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'arrayLengthMatchesProperty', async: false })
@Injectable()
export class ArrayLengthMatchesPropertyConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) return false;
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value.length === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `The number of participantDetails must be equal to the number of participants (${(args.object as any)[relatedPropertyName]}).`;
  }
}
