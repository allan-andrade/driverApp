import { AvailabilityService } from '../availability/availability.service';
import { CreateMySlotDto } from '../availability/dto/create-my-slot.dto';
import { UpdateSlotDto } from '../availability/dto/update-slot.dto';
import { BookingsService } from '../bookings/bookings.service';
import { CreateMyPackageDto } from '../packages/dto/create-my-package.dto';
import { UpdatePackageDto } from '../packages/dto/update-package.dto';
import { PackagesService } from '../packages/packages.service';
import { CreateVehicleDto } from '../vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../vehicles/dto/update-vehicle.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';
import { InstructorsService } from './instructors.service';
export declare class InstructorsController {
    private readonly instructorsService;
    private readonly vehiclesService;
    private readonly availabilityService;
    private readonly packagesService;
    private readonly bookingsService;
    constructor(instructorsService: InstructorsService, vehiclesService: VehiclesService, availabilityService: AvailabilityService, packagesService: PackagesService, bookingsService: BookingsService);
    upsertMe(userId: string, dto: UpsertInstructorDto): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string | null;
        city: string | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    me(userId: string): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.UserStatus;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            refreshTokenHash: string | null;
        };
        vehicles: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string | null;
        city: string | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createMyVehicle(userId: string, dto: CreateVehicleDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }>;
    listMyVehicles(userId: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }[]>;
    updateMyVehicle(userId: string, id: string, dto: UpdateVehicleDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }>;
    deleteMyVehicle(userId: string, id: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        plate: string;
        brand: string;
        model: string;
        year: number;
        transmissionType: import(".prisma/client").$Enums.TransmissionType;
        categorySupported: import(".prisma/client").$Enums.CnhCategory;
    }>;
    createMyAvailability(userId: string, dto: CreateMySlotDto): Promise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
    listMyAvailability(userId: string): Promise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }[]>;
    updateMyAvailability(userId: string, id: string, dto: UpdateSlotDto): Promise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
    deleteMyAvailability(userId: string, id: string): Promise<{
        id: string;
        instructorProfileId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        weekday: number;
        startTime: string;
        endTime: string;
    }>;
    createMyPackage(userId: string, dto: CreateMyPackageDto): Promise<{
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
    }>;
    listMyPackages(userId: string): Promise<{
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
    updateMyPackage(userId: string, id: string, dto: UpdatePackageDto): Promise<{
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
    }>;
    deleteMyPackage(userId: string, id: string): Promise<{
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
    }>;
    listMyBookings(userId: string): Promise<({
        candidateProfile: {
            id: string;
            fullName: string;
        };
        instructorProfile: {
            user: {
                email: string;
            };
            id: string;
        } | null;
        package: {
            id: string;
            title: string;
        } | null;
    } & {
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        priceTotal: import("@prisma/client/runtime/library").Decimal;
        platformFee: import("@prisma/client/runtime/library").Decimal;
        scheduledStart: Date;
        scheduledEnd: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        cancelReason: string | null;
        rescheduleReason: string | null;
        candidateProfileId: string;
        packageId: string | null;
    } & {
        priceTotal: number;
        platformFee: number;
    })[]>;
    search(query: SearchInstructorDto): Promise<{
        id: string;
        fullName: string;
        city: string | null;
        state: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        rating: number;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        categories: import(".prisma/client").$Enums.CnhCategory[];
        hasAvailability: boolean;
        score: number;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__InstructorProfileClient<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.UserStatus;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            refreshTokenHash: string | null;
        };
        reviews: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            candidateProfileId: string;
            bookingId: string;
            punctuality: number;
            didactics: number;
            professionalism: number;
            safety: number;
            examReadiness: number;
            comment: string | null;
        }[];
        schoolLinks: ({
            school: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                state: string | null;
                city: string | null;
                verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
                cnpj: string;
                managerUserId: string | null;
                legalName: string;
                tradeName: string;
                address: string | null;
            };
        } & {
            id: string;
            instructorProfileId: string;
            schoolId: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.LinkStatus;
        })[];
        vehicles: {
            id: string;
            instructorProfileId: string | null;
            schoolId: string | null;
            createdAt: Date;
            updatedAt: Date;
            verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
            plate: string;
            brand: string;
            model: string;
            year: number;
            transmissionType: import(".prisma/client").$Enums.TransmissionType;
            categorySupported: import(".prisma/client").$Enums.CnhCategory;
        }[];
        availabilitySlots: {
            id: string;
            instructorProfileId: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            weekday: number;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string | null;
        city: string | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.UserStatus;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            refreshTokenHash: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        state: string | null;
        city: string | null;
        instructorType: import(".prisma/client").$Enums.InstructorType;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        bio: string | null;
        yearsExperience: number | null;
        serviceRadiusKm: number | null;
        basePrice: import("@prisma/client/runtime/library").Decimal | null;
        isActive: boolean;
        categories: import(".prisma/client").$Enums.CnhCategory[];
    })[]>;
}
