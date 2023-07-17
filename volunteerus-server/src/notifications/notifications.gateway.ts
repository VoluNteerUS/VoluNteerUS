import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { NotificationDto } from './dto/notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/ws/notifications'
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() 
    server: Server;

    @InjectModel(User.name)
    private userModel: Model<UserDocument>;
    
    afterInit(server: Server) {
        console.log('Initialized');
    }

    @SubscribeMessage('notification')
    async handleNotifications(@MessageBody() userId: string) {
        console.log(`Notification for user ${userId}`);
        const user = await this.userModel.findById(userId).exec();

        // Emit the notification to the user's room
        const notification = new NotificationDto(user, 'Test Notification', new Date(), false);
        this.server.to(userId).emit('notificationEvent', notification);
    }

    @SubscribeMessage('joinRoom')
    handleSubscribeToNotifications(@ConnectedSocket() socket: Socket, @MessageBody() userId: string) {
        console.log(`User ${userId} has joined room ${userId}`);
        socket.join(userId);
        return userId;
    }

    sendNotificationToUser(userId: string, notification: NotificationDto) {
        this.server.to(userId).emit('notificationEvent', notification);
    }

    handleDisconnect(client: any) {
        console.log(`Client Disconnected: ${client.id}`);
    }

    handleConnection(client: any, ...args: any[]) {
        console.log(args)
        console.log(`Client Connected: ${client.id}`);
    }
    
}