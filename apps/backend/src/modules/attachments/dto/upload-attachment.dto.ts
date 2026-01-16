import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadAttachmentDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  declare ticketId: number;
}
