import { PrismaService } from '../../prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
export declare class PackagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePackageDto): import(".prisma/client").Prisma.Prisma__PackageClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.CnhCategory;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        usesInstructorVehicle: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listByInstructor(instructorProfileId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.CnhCategory;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        usesInstructorVehicle: boolean;
    }[]>;
    listBySchool(schoolId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: import(".prisma/client").$Enums.CnhCategory;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        usesInstructorVehicle: boolean;
    }[]>;
}
