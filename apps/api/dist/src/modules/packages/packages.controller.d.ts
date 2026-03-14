import { CreatePackageDto } from './dto/create-package.dto';
import { PackagesService } from './packages.service';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
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
    list(instructorProfileId?: string, schoolId?: string): never[] | import(".prisma/client").Prisma.PrismaPromise<{
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
