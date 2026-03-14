import { PrismaService } from '../../prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
export declare class AvailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSlot(dto: CreateSlotDto): import(".prisma/client").Prisma.Prisma__AvailabilitySlotClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listByInstructor(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        instructorProfileId: string;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
}
