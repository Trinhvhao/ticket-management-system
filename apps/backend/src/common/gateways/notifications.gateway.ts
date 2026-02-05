import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<number, Set<string>> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query['userId'] as string;
    
    if (!userId) {
      this.logger.warn(`Client ${client.id} connected without userId`);
      client.disconnect();
      return;
    }

    const userIdNum = parseInt(userId, 10);
    
    if (!this.userSockets.has(userIdNum)) {
      this.userSockets.set(userIdNum, new Set());
    }
    
    this.userSockets.get(userIdNum)!.add(client.id);
    
    this.logger.log(`Client ${client.id} connected for user ${userId}`);
    
    // Join user-specific room
    client.join(`user:${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query['userId'] as string;
    
    if (userId) {
      const userIdNum = parseInt(userId, 10);
      const sockets = this.userSockets.get(userIdNum);
      
      if (sockets) {
        sockets.delete(client.id);
        
        if (sockets.size === 0) {
          this.userSockets.delete(userIdNum);
        }
      }
    }
    
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Send notification to specific user
   */
  sendNotificationToUser(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.log(`Sent notification to user ${userId}`);
  }

  /**
   * Send notification to multiple users
   */
  sendNotificationToUsers(userIds: number[], notification: any) {
    userIds.forEach(userId => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcastNotification(notification: any) {
    this.server.emit('notification', notification);
    this.logger.log('Broadcast notification to all users');
  }

  /**
   * Send unread count update to user
   */
  sendUnreadCountUpdate(userId: number, count: number) {
    this.server.to(`user:${userId}`).emit('unreadCount', count);
  }

  @SubscribeMessage('markAsRead')
  handleMarkAsRead(client: Socket, notificationId: number) {
    const userId = client.handshake.query['userId'] as string;
    this.logger.log(`User ${userId} marked notification ${notificationId} as read`);
    // This will be handled by the NotificationsService
    return { success: true };
  }

  @SubscribeMessage('getUnreadCount')
  handleGetUnreadCount(client: Socket) {
    const userId = client.handshake.query['userId'] as string;
    this.logger.log(`User ${userId} requested unread count`);
    // This will be handled by the NotificationsService
    return { success: true };
  }
}
