import { BadRequestException, PipeTransform } from '@nestjs/common';

export class BoardStatusValidationPip implements PipeTransform {
  readonly StatusOptions = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
  };

  transform(value: string) {
    if (!this.isStatusValid(value.toUpperCase())) {
      throw new BadRequestException(`'${value}' isn't in the status options`);
    }
    return value;
  }

  private isStatusValid(status: string) {
    const isExist = this.StatusOptions[status];
    return isExist ? true : false;
  }
}
