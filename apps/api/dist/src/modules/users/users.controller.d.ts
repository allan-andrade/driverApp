import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(userId: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    findByRole(role: UserRole): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
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
