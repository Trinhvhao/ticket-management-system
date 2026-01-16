import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { AttachmentsService } from './attachments.service';
import { UploadAttachmentDto, AttachmentResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../database/entities/user.entity';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {
    // Ensure upload directory exists
    this.attachmentsService.ensureUploadDirectory('./uploads/attachments');
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/attachments',
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadAttachmentDto,
    @CurrentUser() user: any,
  ): Promise<AttachmentResponseDto> {
    return this.attachmentsService.uploadAttachment(file, uploadDto, user.id);
  }

  @Get()
  async findAll(
    @Query('ticketId', new ParseIntPipe({ optional: true })) ticketId?: number,
  ): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.findAll(ticketId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentsService.findOne(id);
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

  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Res() res: Response,
  ): Promise<void> {
    const { stream, attachment } = await this.attachmentsService.getFileStream(
      id,
      user.id,
      user.role,
    );

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(attachment.originalName)}"`,
    );
    res.setHeader('Content-Length', attachment.fileSize);

    stream.pipe(res);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.IT_STAFF)
  async deleteAttachment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.attachmentsService.deleteAttachment(id, user.id, user.role);
    return {
      message: 'Attachment deleted successfully',
    };
  }
}
