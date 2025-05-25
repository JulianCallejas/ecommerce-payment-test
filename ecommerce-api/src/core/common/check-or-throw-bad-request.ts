import { BadRequestException } from '@nestjs/common';

export const checkOrThrowBadrequest = (condition: boolean, message: string) => {
  if (!condition) {
    throw new BadRequestException(message);
  }
};
