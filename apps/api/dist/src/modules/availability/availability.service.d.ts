import { PrismaService } from '../../prisma.service';
import { CreateMySlotDto } from './dto/create-my-slot.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
export declare class AvailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSlot(dto: CreateSlotDto): import(".prisma/client").Prisma.Prisma__AvailabilitySlotClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listByInstructor(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
    private getInstructorProfileIdByUserId;
    createMine(userId: string, dto: CreateMySlotDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
    listMine(userId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
    updateMine(userId: string, id: string, dto: UpdateSlotDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
    removeMine(userId: string, id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
}
