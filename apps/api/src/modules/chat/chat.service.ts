import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ChatMessageType, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveActorScope(userId: string, role: UserRole) {
    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      return { candidateProfileId: candidate?.id ?? null, instructorProfileId: null, schoolId: null };
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      return { candidateProfileId: null, instructorProfileId: instructor?.id ?? null, schoolId: null };
    }

    if (role === UserRole.SCHOOL_MANAGER) {
      const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
      return { candidateProfileId: null, instructorProfileId: null, schoolId: school?.id ?? null };
    }

    return { candidateProfileId: null, instructorProfileId: null, schoolId: null };
  }

  private async assertConversationAccess(conversationId: string, userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.prisma.chatConversation.findUnique({ where: { id: conversationId } });
    }

    const actor = await this.resolveActorScope(userId, role);
    const conversation = await this.prisma.chatConversation.findUnique({ where: { id: conversationId } });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    const allowed =
      (actor.candidateProfileId && actor.candidateProfileId === conversation.candidateProfileId) ||
      (actor.instructorProfileId && actor.instructorProfileId === conversation.instructorProfileId) ||
      (actor.schoolId && actor.schoolId === conversation.schoolId);

    if (!allowed) {
      throw new UnauthorizedException('You are not allowed to access this conversation.');
    }

    return conversation;
  }

  async getOrCreateByBooking(bookingId: string, userId: string, role: UserRole) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    if (role !== UserRole.ADMIN) {
      const actor = await this.resolveActorScope(userId, role);
      const allowed =
        (actor.candidateProfileId && actor.candidateProfileId === booking.candidateProfileId) ||
        (actor.instructorProfileId && actor.instructorProfileId === booking.instructorProfileId) ||
        (actor.schoolId && actor.schoolId === booking.schoolId);

      if (!allowed) {
        throw new UnauthorizedException('You are not allowed to access this booking chat.');
      }
    }

    const existing = await this.prisma.chatConversation.findFirst({ where: { bookingId } });
    if (existing) {
      return existing;
    }

    return this.prisma.chatConversation.create({
      data: {
        bookingId,
        candidateProfileId: booking.candidateProfileId,
        instructorProfileId: booking.instructorProfileId,
        schoolId: booking.schoolId,
      },
    });
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.prisma.chatConversation.findMany({
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
        take: 200,
      });
    }

    const actor = await this.resolveActorScope(userId, role);
    const actorFilters: Prisma.ChatConversationWhereInput[] = [];

    if (actor.candidateProfileId) {
      actorFilters.push({ candidateProfileId: actor.candidateProfileId });
    }
    if (actor.instructorProfileId) {
      actorFilters.push({ instructorProfileId: actor.instructorProfileId });
    }
    if (actor.schoolId) {
      actorFilters.push({ schoolId: actor.schoolId });
    }

    return this.prisma.chatConversation.findMany({
      where: {
        OR: actorFilters,
      },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
      take: 200,
    });
  }

  async listMessages(conversationId: string, userId: string, role: UserRole) {
    await this.assertConversationAccess(conversationId, userId, role);

    return this.prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 500,
    });
  }

  async sendMessage(conversationId: string, userId: string, role: UserRole, dto: SendChatMessageDto) {
    await this.assertConversationAccess(conversationId, userId, role);

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId,
          senderUserId: userId,
          content: dto.content,
          type: dto.type ?? ChatMessageType.TEXT,
        },
      });

      await tx.chatConversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: message.createdAt },
      });

      return message;
    });
  }
}
