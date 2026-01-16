import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

@Table({
  tableName: 'attachments',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['ticket_id'] },
    { fields: ['uploaded_by'] },
  ],
})
export class Attachment extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Ticket)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'ticket_id',
  })
  declare ticketId: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'file_name',
  })
  declare fileName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'original_name',
  })
  declare originalName: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    field: 'file_path',
  })
  declare filePath: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'file_size',
  })
  declare fileSize: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'mime_type',
  })
  declare mimeType: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'uploaded_by',
  })
  declare uploadedBy: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt: Date;

  // Associations
  @BelongsTo(() => Ticket)
  declare ticket?: Ticket;

  @BelongsTo(() => User, 'uploadedBy')
  declare uploader: User;

  // Virtual properties
  get isImage(): boolean {
    return this.mimeType?.startsWith('image/') || false;
  }

  get isPdf(): boolean {
    return this.mimeType === 'application/pdf';
  }

  get isDocument(): boolean {
    const docTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    return docTypes.includes(this.mimeType);
  }

  get fileSizeFormatted(): string {
    const bytes = this.fileSize;
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get fileExtension(): string {
    return this.originalName?.split('.').pop()?.toLowerCase() || '';
  }

  // Business methods
  canBeDeletedBy(userId: number, userRole: string): boolean {
    return this.uploadedBy === userId || userRole === 'Admin';
  }

  canBeDownloadedBy(_userId: number, _userRole: string): boolean {
    // All authenticated users can download attachments
    return true;
  }

  // Static methods
  static getAllowedMimeTypes(): string[] {
    return [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
    ];
  }

  static getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }

  static isAllowedMimeType(mimeType: string): boolean {
    return this.getAllowedMimeTypes().includes(mimeType);
  }

  // Serialization
  override toJSON() {
    const values = { ...this.get() } as any;
    delete values.filePath; // Don't expose internal file path
    return values;
  }
}