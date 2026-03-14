import { AvailabilityService } from './availability.service';
import { CreateSlotDto } from './dto/create-slot.dto';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    create(dto: CreateSlotDto): import(".prisma/client").Prisma.Prisma__AvailabilitySlotClient<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
}
