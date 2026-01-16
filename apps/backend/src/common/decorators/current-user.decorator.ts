import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/entities';

/**
 * Decorator to extract current user from request
 * User is set by JwtAuthGuard after successful authentication
 * @example
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext): User | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If specific property is requested, return that property
    if (data) {
      return user?.[data];
    }

    // Return full user object
    return user;
  },
);

/**
 * Decorator to extract current user ID
 * @example
 * @Get('my-tickets')
 * @UseGuards(JwtAuthGuard)
 * getMyTickets(@CurrentUserId() userId: string) {
 *   return this.ticketsService.findByUserId(userId);
 * }
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Decorator to extract current user role
 * @example
 * @Get('role-specific')
 * @UseGuards(JwtAuthGuard)
 * getRoleSpecific(@CurrentUserRole() role: UserRole) {
 *   return { role };
 * }
 */
export const CurrentUserRole = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);