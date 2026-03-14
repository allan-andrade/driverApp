import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ChatService } from './chat.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.chatService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Post('booking/:bookingId')
  getOrCreate(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.chatService.getOrCreateByBooking(bookingId, user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get(':conversationId/messages')
  messages(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.chatService.listMessages(conversationId, user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Post(':conversationId/messages')
  send(
    @Param('conversationId') conversationId: string,
    @Body() dto: SendChatMessageDto,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.chatService.sendMessage(conversationId, user.userId, user.role, dto);
  }
}
