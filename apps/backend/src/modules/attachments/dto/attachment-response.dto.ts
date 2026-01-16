export class AttachmentResponseDto {
  declare id: number;
  declare ticketId: number;
  declare fileName: string;
  declare originalName: string;
  declare mimeType: string;
  declare fileSize: number;
  declare fileSizeFormatted: string;
  declare fileExtension: string;
  declare uploadedBy: number;
  declare isImage: boolean;
  declare isPdf: boolean;
  declare isDocument: boolean;
  declare createdAt: Date;
}
