import { Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<User>;
    findById(id: string): Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail(email: string): Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateRefreshToken(userId: string, refreshTokenHash: string | null): Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    }[]>;
    listByRole(role: UserRole): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        refreshTokenHash: string | null;
    }[]>;
}
