import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../database/entities';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * @param roles - Array of required user roles
 * @example
 * @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
 * @Get('admin-only')
 * adminOnlyRoute() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Predefined role decorators for common use cases
 */
export const AdminOnly = () => Roles(UserRole.ADMIN);
export const ITStaffOnly = () => Roles(UserRole.IT_STAFF);
export const ITStaffOrAdmin = () => Roles(UserRole.IT_STAFF, UserRole.ADMIN);
export const EmployeeOnly = () => Roles(UserRole.EMPLOYEE);
export const AllRoles = () => Roles(UserRole.EMPLOYEE, UserRole.IT_STAFF, UserRole.ADMIN);