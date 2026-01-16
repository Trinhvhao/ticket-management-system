import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { CommentType } from '../../../database/entities/comment.entity';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'Comment content cannot exceed 5000 characters' })
  content!: string;

  @IsEnum(CommentType)
  @IsOptional()
  type?: CommentType;
}
