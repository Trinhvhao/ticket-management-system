import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '../../database/entities/attachment.entity';
import { UploadAttachmentDto, AttachmentResponseDto } from './dto';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment)
    private attachmentModel: typeof Attachment,
  ) {}

  async uploadAttachment(
    file: Express.Multer.File,
    uploadDto: UploadAttachmentDto,
    userId: number,
  ): Promise<AttachmentResponseDto> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate mime type
    if (!Attachment.isAllowedMimeType(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${Attachment.getAllowedMimeTypes().join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > Attachment.getMaxFileSize()) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${Attachment.getMaxFileSize() / 1024 / 1024}MB`,
      );
    }

    try {
      // Create attachment record
      const attachment = await this.attachmentModel.create({
        ticketId: uploadDto.ticketId,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: userId,
      });

      return this.toResponseDto(attachment);
    } catch (error) {
      // Clean up uploaded file if database operation fails
      try {
        await unlinkAsync(file.path);
      } catch (unlinkError) {
        console.error('Failed to delete file after error:', unlinkError);
      }
      throw new InternalServerErrorException('Failed to save attachment');
    }
  }

  async findAll(ticketId?: number): Promise<AttachmentResponseDto[]> {
    const where: any = {};

    if (ticketId) {
      where.ticketId = ticketId;
    }

    const attachments = await this.attachmentModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return attachments.map((attachment) => this.toResponseDto(attachment));
  }

  async findOne(id: number): Promise<Attachment> {
    const attachment = await this.attachmentModel.findByPk(id);

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  async getFileStream(id: number, userId: number, userRole: string): Promise<{
    stream: fs.ReadStream;
    attachment: Attachment;
  }> {
    const attachment = await this.findOne(id);

    // Check permissions
    if (!attachment.canBeDownloadedBy(userId, userRole)) {
      throw new ForbiddenException('You do not have permission to download this file');
    }

    // Check if file exists
    if (!fs.existsSync(attachment.filePath)) {
      throw new NotFoundException('File not found on server');
    }

    const stream = fs.createReadStream(attachment.filePath);

    return { stream, attachment };
  }

  async deleteAttachment(id: number, userId: number, userRole: string): Promise<void> {
    const attachment = await this.findOne(id);

    // Check permissions
    if (!attachment.canBeDeletedBy(userId, userRole)) {
      throw new ForbiddenException('You do not have permission to delete this file');
    }

    // Delete file from disk
    try {
      if (fs.existsSync(attachment.filePath)) {
        await unlinkAsync(attachment.filePath);
      }
    } catch (error) {
      console.error('Failed to delete file from disk:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Hard delete from database (no soft delete in schema)
    await attachment.destroy();
  }

  async ensureUploadDirectory(uploadPath: string): Promise<void> {
    try {
      if (!fs.existsSync(uploadPath)) {
        await mkdirAsync(uploadPath, { recursive: true });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create upload directory');
    }
  }

  private toResponseDto(attachment: Attachment): AttachmentResponseDto {
    return {
      id: attachment.id,
      ticketId: attachment.ticketId,
      fileName: attachment.fileName,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,
      fileSizeFormatted: attachment.fileSizeFormatted,
      fileExtension: attachment.fileExtension,
      uploadedBy: attachment.uploadedBy,
      isImage: attachment.isImage,
      isPdf: attachment.isPdf,
      isDocument: attachment.isDocument,
      createdAt: attachment.createdAt,
    };
  }
}
