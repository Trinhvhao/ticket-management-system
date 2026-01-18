// Database entities barrel exports
import { User, UserRole } from './user.entity';
import { Ticket, TicketStatus, TicketPriority } from './ticket.entity';
import { Category } from './category.entity';
import { Comment, CommentType } from './comment.entity';
import { Attachment } from './attachment.entity';
import { KnowledgeArticle } from './knowledge-article.entity';
import { Notification, NotificationType } from './notification.entity';
import { TicketHistory, TicketHistoryAction } from './ticket-history.entity';
import { SlaRule } from './sla-rule.entity';
import { AuditLog } from './audit-log.entity';
import { BusinessHours } from './business-hours.entity';
import { Holiday } from './holiday.entity';
import { EscalationRule, EscalationTriggerType, EscalationTargetType } from './escalation-rule.entity';
import { EscalationHistory } from './escalation-history.entity';
import { RefreshToken } from './refresh-token.entity';

export { User, UserRole };
export { Ticket, TicketStatus, TicketPriority };
export { Category };
export { Comment, CommentType };
export { Attachment };
export { KnowledgeArticle };
export { Notification, NotificationType };
export { TicketHistory, TicketHistoryAction };
export { SlaRule };
export { AuditLog };
export { BusinessHours };
export { Holiday };
export { EscalationRule, EscalationTriggerType, EscalationTargetType };
export { EscalationHistory };
export { RefreshToken };

// Entity array for Sequelize configuration
export const entities = [
  User,
  Ticket,
  Category,
  Comment,
  Attachment,
  KnowledgeArticle,
  Notification,
  TicketHistory,
  SlaRule,
  AuditLog,
  BusinessHours,
  Holiday,
  EscalationRule,
  EscalationHistory,
  RefreshToken,
];