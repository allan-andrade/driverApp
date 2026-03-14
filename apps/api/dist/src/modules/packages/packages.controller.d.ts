import { CreatePackageDto } from './dto/create-package.dto';
import { PackagesService } from './packages.service';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
    create(dto: CreatePackageDto): import(".prisma/client").Prisma.Prisma__PackageClient<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        category: import(".prisma/client").$Enums.CnhCategory;
        price: import("@prisma/client/runtime/library").Decimal;
        usesInstructorVehicle: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(instructorProfileId?: string, schoolId?: string): never[] | import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        title: string;
        lessonCount: number;
        durationMinutes: number;
        category: import(".prisma/client").$Enums.CnhCategory;
        price: import("@prisma/client/runtime/library").Decimal;
        usesInstructorVehicle: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
