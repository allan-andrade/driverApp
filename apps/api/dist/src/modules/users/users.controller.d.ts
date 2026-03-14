import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByRole(role: UserRole): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        phone: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
