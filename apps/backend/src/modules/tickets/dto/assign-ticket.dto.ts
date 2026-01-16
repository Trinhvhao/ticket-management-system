import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignTicketDto {
  @IsInt({ message: 'Assignee ID must be an integer' })
  @IsNotEmpty({ message: 'Assignee ID is required' })
  assigneeId!: number;
}
