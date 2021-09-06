import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class ReadOnlyCatDto extends OmitType(Cat, ['password']) {
  @ApiProperty({
    example: 'string',
    description: 'id',
  })
  readonly id: string;
}
