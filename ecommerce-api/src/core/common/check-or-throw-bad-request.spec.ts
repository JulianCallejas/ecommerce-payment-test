import { BadRequestException } from '@nestjs/common';
import { checkOrThrowBadrequest } from './check-or-throw-bad-request';

describe('checkOrThrowBadRequest', () => {
  it('should throw BadRequestException when condition is false', () => {
    const message = 'Invalid input';

    expect(() => {
      checkOrThrowBadrequest(false, message);
    }).toThrow(BadRequestException);

    expect(() => {
      checkOrThrowBadrequest(false, message);
    }).toThrow(message);
  });

  it('should not throw when condition is true', () => {
    expect(() => {
      checkOrThrowBadrequest(true, 'This should not throw');
    }).not.toThrow();
  });
});
