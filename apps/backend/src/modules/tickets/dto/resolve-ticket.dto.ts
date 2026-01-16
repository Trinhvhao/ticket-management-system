import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResolveTicketDto {
  @IsString({ message: 'Resolution notes must be a string' })
  @IsNotEmpty({ message: 'Resolution notes are required' })
  @MinLength(10, { message: 'Resolution notes must be at least 10 characters long' })
  resolutionNotes!: string;
}
