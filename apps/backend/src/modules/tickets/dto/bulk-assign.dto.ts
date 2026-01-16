import { IsArray, IsInt, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkAssignDto {
  @ApiProperty({
    description: 'Array of ticket IDs to assign',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ticketIds!: number[];

  @ApiProperty({
    description: 'ID of the user to assign tickets to',
    example: 5,
  })
  @IsInt()
  assigneeId!: number;
}
