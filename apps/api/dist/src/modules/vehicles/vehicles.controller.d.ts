import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(dto: CreateVehicleDto): import(".prisma/client").Prisma.Prisma__VehicleClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        instructorProfileId: string | null;
        schoolId: string | null;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(instructorProfileId?: string, schoolId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        instructorProfileId: string | null;
        schoolId: string | null;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }[]> | never[];
}
