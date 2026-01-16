import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'Comment content cannot exceed 5000 characters' })
  content!: string;
}
