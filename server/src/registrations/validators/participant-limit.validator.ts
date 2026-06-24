import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { participantLimits } from '../constants';
import { CreateRegistrationDto } from '../dto/create-registration.dto';

@ValidatorConstraint({ name: 'isParticipantCountValidForEvent', async: false })
@Injectable()
export class IsParticipantCountValidForEventConstraint
  implements ValidatorConstraintInterface
{
  validate(additionalParticipants: number, args: ValidationArguments) {
    const object = args.object as CreateRegistrationDto;
    const event = object.event;

    // The number of additional participants must be a non-negative integer.
    if (
      typeof additionalParticipants !== 'number' ||
      additionalParticipants < 0 ||
      !Number.isInteger(additionalParticipants)
    ) {
      return false;
    }

    const maxAllowed = participantLimits[event];

    // If no limit is defined for the event in the constants file, allow it.
    if (maxAllowed === undefined) {
      return true;
    }

    return additionalParticipants <= maxAllowed;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateRegistrationDto;
    const event = object.event;
    const maxAllowed = participantLimits[event];

    if (maxAllowed === undefined) {
      return `An unknown error occurred validating participants for event '${event}'.`;
    }

    if (maxAllowed === 0) {
      return `The event '${event}' is a solo event; no additional participants are allowed.`;
    }

    return `For the event '${event}', the number of additional participants cannot exceed ${maxAllowed}.`;
  }
}
