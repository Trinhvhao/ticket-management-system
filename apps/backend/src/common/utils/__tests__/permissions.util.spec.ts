import { PermissionsUtil } from '../permissions.util';
import { UserRole } from '../../../database/entities';

describe('PermissionsUtil - Ticket Permissions', () => {
  describe('canViewTicket', () => {
    it('should allow Admin to view any ticket', () => {
      const admin = { id: 1, role: UserRole.ADMIN } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canViewTicket(admin, ticket)).toBe(true);
    });

    it('should allow IT_Staff to view any ticket', () => {
      const itStaff = { id: 1, role: UserRole.IT_STAFF } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canViewTicket(itStaff, ticket)).toBe(true);
    });

    it('should allow Employee to view own ticket', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 1 } as any;
      
      expect(PermissionsUtil.canViewTicket(employee, ticket)).toBe(true);
    });

    it('should NOT allow Employee to view other tickets', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canViewTicket(employee, ticket)).toBe(false);
    });
  });

  describe('canEditTicket', () => {
    it('should allow Admin to edit any ticket', () => {
      const admin = { id: 1, role: UserRole.ADMIN } as any;
      const ticket = { id: 1, submitterId: 2, status: 'Closed' } as any;
      
      expect(PermissionsUtil.canEditTicket(admin, ticket)).toBe(true);
    });

    it('should allow IT_Staff to edit any ticket', () => {
      const itStaff = { id: 1, role: UserRole.IT_STAFF } as any;
      const ticket = { id: 1, submitterId: 2, status: 'In Progress' } as any;
      
      expect(PermissionsUtil.canEditTicket(itStaff, ticket)).toBe(true);
    });

    it('should allow Employee to edit own ticket when status is New', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 1, status: 'New' } as any;
      
      expect(PermissionsUtil.canEditTicket(employee, ticket)).toBe(true);
    });

    it('should allow Employee to edit own ticket when status is Assigned', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 1, status: 'Assigned' } as any;
      
      expect(PermissionsUtil.canEditTicket(employee, ticket)).toBe(true);
    });

    it('should NOT allow Employee to edit own ticket when status is Closed', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 1, status: 'Closed' } as any;
      
      expect(PermissionsUtil.canEditTicket(employee, ticket)).toBe(false);
    });

    it('should NOT allow Employee to edit other user ticket', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 2, status: 'New' } as any;
      
      expect(PermissionsUtil.canEditTicket(employee, ticket)).toBe(false);
    });
  });

  describe('canDeleteTicket', () => {
    it('should allow Admin to delete ticket', () => {
      const admin = { id: 1, role: UserRole.ADMIN } as any;
      
      expect(PermissionsUtil.canDeleteTicket(admin)).toBe(true);
    });

    it('should NOT allow IT_Staff to delete ticket', () => {
      const itStaff = { id: 1, role: UserRole.IT_STAFF } as any;
      
      expect(PermissionsUtil.canDeleteTicket(itStaff)).toBe(false);
    });

    it('should NOT allow Employee to delete ticket', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      
      expect(PermissionsUtil.canDeleteTicket(employee)).toBe(false);
    });
  });

  describe('canAssignTicket', () => {
    it('should allow Admin to assign ticket', () => {
      const admin = { id: 1, role: UserRole.ADMIN } as any;
      
      expect(PermissionsUtil.canAssignTicket(admin)).toBe(true);
    });

    it('should allow IT_Staff to assign ticket', () => {
      const itStaff = { id: 1, role: UserRole.IT_STAFF } as any;
      
      expect(PermissionsUtil.canAssignTicket(itStaff)).toBe(true);
    });

    it('should NOT allow Employee to assign ticket', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      
      expect(PermissionsUtil.canAssignTicket(employee)).toBe(false);
    });
  });

  describe('canChangeTicketStatus', () => {
    it('should allow Admin to change any ticket status', () => {
      const admin = { id: 1, role: UserRole.ADMIN } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canChangeTicketStatus(admin, ticket)).toBe(true);
    });

    it('should allow IT_Staff to change any ticket status', () => {
      const itStaff = { id: 1, role: UserRole.IT_STAFF } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canChangeTicketStatus(itStaff, ticket)).toBe(true);
    });

    it('should allow Employee to change own ticket status', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 1 } as any;
      
      expect(PermissionsUtil.canChangeTicketStatus(employee, ticket)).toBe(true);
    });

    it('should NOT allow Employee to change other ticket status', () => {
      const employee = { id: 1, role: UserRole.EMPLOYEE } as any;
      const ticket = { id: 1, submitterId: 2 } as any;
      
      expect(PermissionsUtil.canChangeTicketStatus(employee, ticket)).toBe(false);
    });
  });
});
