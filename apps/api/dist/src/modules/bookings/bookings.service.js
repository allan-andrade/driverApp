"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
const packages_service_1 = require("../packages/packages.service");
let BookingsService = class BookingsService {
    prisma;
    auditService;
    packagesService;
    constructor(prisma, auditService, packagesService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.packagesService = packagesService;
    }
    toMinutes(time) {
        const [hour = 0, minute = 0] = time.split(':').map(Number);
        return hour * 60 + minute;
    }
    validateWindow(start, end) {
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid schedule date/time.');
        }
        if (end <= start) {
            throw new common_1.BadRequestException('scheduledEnd must be greater than scheduledStart.');
        }
        if (start <= new Date()) {
            throw new common_1.BadRequestException('Booking must be scheduled in the future.');
        }
    }
    getWeekdayUtc(date) {
        return date.getUTCDay();
    }
    getMinutesUtc(date) {
        return date.getUTCHours() * 60 + date.getUTCMinutes();
    }
    async validateInstructorAvailability(instructorProfileId, start, end) {
        const weekday = this.getWeekdayUtc(start);
        const startMinutes = this.getMinutesUtc(start);
        const endMinutes = this.getMinutesUtc(end);
        const slots = await this.prisma.availabilitySlot.findMany({
            where: {
                instructorProfileId,
                weekday,
                isActive: true,
            },
        });
        const isCompatible = slots.some((slot) => {
            const slotStart = this.toMinutes(slot.startTime);
            const slotEnd = this.toMinutes(slot.endTime);
            return startMinutes >= slotStart && endMinutes <= slotEnd;
        });
        if (!isCompatible) {
            throw new common_1.BadRequestException('Requested schedule is outside instructor availability.');
        }
    }
    async validateInstructorConflict(instructorProfileId, start, end, excludeBookingId) {
        const conflict = await this.prisma.booking.findFirst({
            where: {
                instructorProfileId,
                id: excludeBookingId ? { not: excludeBookingId } : undefined,
                status: { in: [client_1.BookingStatus.PENDING, client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.RESCHEDULED] },
                scheduledStart: { lt: end },
                scheduledEnd: { gt: start },
            },
        });
        if (conflict) {
            throw new common_1.BadRequestException('Instructor already has a booking in this time range.');
        }
    }
    async calculateAmounts(dto) {
        if (dto.packageId) {
            const packageItem = await this.packagesService.findOne(dto.packageId);
            return {
                priceTotal: Number(packageItem.price),
                platformFee: Number((Number(packageItem.price) * 0.12).toFixed(2)),
            };
        }
        const priceTotal = dto.priceTotal;
        if (priceTotal === undefined) {
            throw new common_1.BadRequestException('priceTotal is required when packageId is not provided.');
        }
        const platformFee = dto.platformFee ?? Number((priceTotal * 0.12).toFixed(2));
        return { priceTotal, platformFee };
    }
    buildPinCode() {
        return String(Math.floor(1000 + Math.random() * 9000));
    }
    normalizeBooking(booking) {
        return {
            ...booking,
            priceTotal: Number(booking.priceTotal),
            platformFee: Number(booking.platformFee),
        };
    }
    async resolveActorScope(userId, role) {
        const [candidate, instructor, school] = await Promise.all([
            role === client_1.UserRole.CANDIDATE ? this.prisma.candidateProfile.findUnique({ where: { userId } }) : null,
            role === client_1.UserRole.INSTRUCTOR ? this.prisma.instructorProfile.findUnique({ where: { userId } }) : null,
            role === client_1.UserRole.SCHOOL_MANAGER ? this.prisma.school.findUnique({ where: { managerUserId: userId } }) : null,
        ]);
        return {
            candidateProfileId: candidate?.id,
            instructorProfileId: instructor?.id,
            schoolId: school?.id,
        };
    }
    async assertBookingAccess(booking, userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return;
        }
        const scope = await this.resolveActorScope(userId, role);
        const allowed = (scope.candidateProfileId && booking.candidateProfileId === scope.candidateProfileId) ||
            (scope.instructorProfileId && booking.instructorProfileId === scope.instructorProfileId) ||
            (scope.schoolId && booking.schoolId === scope.schoolId);
        if (!allowed) {
            throw new common_1.UnauthorizedException('You are not allowed to manage this booking.');
        }
    }
    async create(dto, actorUserId) {
        if (!dto.candidateProfileId) {
            throw new common_1.UnauthorizedException('candidateProfileId is required.');
        }
        const candidateProfileId = dto.candidateProfileId;
        const scheduledStart = new Date(dto.scheduledStart);
        const scheduledEnd = new Date(dto.scheduledEnd);
        this.validateWindow(scheduledStart, scheduledEnd);
        if (!dto.instructorProfileId) {
            throw new common_1.BadRequestException('instructorProfileId is required.');
        }
        const instructorProfile = await this.prisma.instructorProfile.findUnique({
            where: { id: dto.instructorProfileId },
        });
        if (!instructorProfile || !instructorProfile.isActive) {
            throw new common_1.BadRequestException('Instructor is not active or does not exist.');
        }
        await this.validateInstructorAvailability(dto.instructorProfileId, scheduledStart, scheduledEnd);
        await this.validateInstructorConflict(dto.instructorProfileId, scheduledStart, scheduledEnd);
        const { priceTotal, platformFee } = await this.calculateAmounts(dto);
        const booking = await this.prisma.$transaction(async (tx) => {
            const created = await tx.booking.create({
                data: {
                    candidateProfileId,
                    instructorProfileId: dto.instructorProfileId,
                    schoolId: dto.schoolId,
                    packageId: dto.packageId,
                    scheduledStart,
                    scheduledEnd,
                    priceTotal,
                    platformFee,
                    status: client_1.BookingStatus.CONFIRMED,
                    paymentStatus: client_1.PaymentStatus.PENDING,
                },
            });
            await tx.payment.create({
                data: {
                    bookingId: created.id,
                    candidateProfileId: created.candidateProfileId,
                    instructorProfileId: created.instructorProfileId,
                    schoolId: created.schoolId,
                    amount: Number(priceTotal),
                    platformFee: Number(platformFee),
                    status: client_1.PaymentStatus.PENDING,
                    method: 'MANUAL',
                    currency: 'BRL',
                    provider: 'stub',
                    splitMetadataJson: { providerHint: 'stripe|pagarme|asaas' },
                },
            });
            if (created.instructorProfileId) {
                await tx.lesson.create({
                    data: {
                        bookingId: created.id,
                        candidateProfileId: created.candidateProfileId,
                        instructorProfileId: created.instructorProfileId,
                        pinCode: this.buildPinCode(),
                        status: client_1.LessonStatus.SCHEDULED,
                    },
                });
            }
            return created;
        });
        await this.auditService.log({
            actorUserId,
            entityType: client_1.EntityType.BOOKING,
            entityId: booking.id,
            action: 'BOOKING_CREATED',
            metadataJson: {
                candidateProfileId: booking.candidateProfileId,
                instructorProfileId: booking.instructorProfileId,
                scheduledStart: booking.scheduledStart,
                scheduledEnd: booking.scheduledEnd,
            },
        });
        return this.normalizeBooking(booking);
    }
    async createForCandidate(userId, dto) {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
        if (!candidateProfile) {
            throw new common_1.UnauthorizedException('Candidate profile not found for this user.');
        }
        return this.create({
            ...dto,
            candidateProfileId: candidateProfile.id,
        }, userId);
    }
    async list(filters) {
        const bookings = await this.prisma.booking.findMany({
            where: filters,
            orderBy: { scheduledStart: 'asc' },
            include: {
                candidateProfile: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                instructorProfile: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                package: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return bookings.map((item) => this.normalizeBooking(item));
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
            if (!candidate)
                throw new common_1.NotFoundException('Candidate profile not found.');
            return this.list({ candidateProfileId: candidate.id });
        }
        if (role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
            if (!instructor)
                throw new common_1.NotFoundException('Instructor profile not found.');
            return this.list({ instructorProfileId: instructor.id });
        }
        if (role === client_1.UserRole.SCHOOL_MANAGER) {
            const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
            if (!school)
                throw new common_1.NotFoundException('School not found.');
            return this.list({ schoolId: school.id });
        }
        return this.prisma.booking.findMany({ orderBy: { scheduledStart: 'asc' }, take: 100 });
    }
    async cancel(id, dto, actorUser) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        if (actorUser) {
            await this.assertBookingAccess(booking, actorUser.userId, actorUser.role);
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled.');
        }
        if (booking.status === client_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Completed bookings cannot be cancelled.');
        }
        const lesson = await this.prisma.lesson.findFirst({ where: { bookingId: id } });
        if (lesson?.status === client_1.LessonStatus.IN_PROGRESS || lesson?.status === client_1.LessonStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel booking with lesson already in progress or completed.');
        }
        const hoursToStart = (booking.scheduledStart.getTime() - Date.now()) / (1000 * 60 * 60);
        if (actorUser?.role === client_1.UserRole.CANDIDATE && hoursToStart < 24) {
            throw new common_1.BadRequestException('Candidate cancellation requires at least 24 hours notice.');
        }
        if (actorUser?.role === client_1.UserRole.INSTRUCTOR && hoursToStart < 6) {
            throw new common_1.BadRequestException('Instructor cancellation requires at least 6 hours notice.');
        }
        const cancelled = await this.prisma.booking.update({
            where: { id },
            data: {
                status: client_1.BookingStatus.CANCELLED,
                paymentStatus: client_1.PaymentStatus.CANCELLED,
                cancelReason: dto.reason,
            },
        });
        await this.prisma.lesson.updateMany({
            where: {
                bookingId: id,
                status: { in: [client_1.LessonStatus.SCHEDULED, client_1.LessonStatus.CHECK_IN_PENDING] },
            },
            data: {
                status: client_1.LessonStatus.CANCELLED,
                notes: dto.reason,
            },
        });
        await this.prisma.payment.updateMany({
            where: {
                bookingId: id,
                status: { in: [client_1.PaymentStatus.PENDING, client_1.PaymentStatus.AUTHORIZED] },
            },
            data: {
                status: client_1.PaymentStatus.CANCELLED,
            },
        });
        await this.auditService.log({
            actorUserId: actorUser?.userId,
            entityType: client_1.EntityType.BOOKING,
            entityId: id,
            action: 'BOOKING_CANCELLED',
            metadataJson: {
                previousStatus: booking.status,
                reason: dto.reason,
            },
        });
        return this.normalizeBooking(cancelled);
    }
    async reschedule(id, dto, actorUser) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        if (actorUser) {
            await this.assertBookingAccess(booking, actorUser.userId, actorUser.role);
        }
        if (!booking.instructorProfileId) {
            throw new common_1.BadRequestException('Booking has no instructor assigned.');
        }
        if (booking.status === client_1.BookingStatus.CANCELLED || booking.status === client_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Only active bookings can be rescheduled.');
        }
        const lesson = await this.prisma.lesson.findFirst({ where: { bookingId: id } });
        if (lesson?.status === client_1.LessonStatus.IN_PROGRESS || lesson?.status === client_1.LessonStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot reschedule booking with lesson already in progress or completed.');
        }
        const currentHoursToStart = (booking.scheduledStart.getTime() - Date.now()) / (1000 * 60 * 60);
        if (actorUser?.role === client_1.UserRole.CANDIDATE && currentHoursToStart < 12) {
            throw new common_1.BadRequestException('Candidate reschedule requires at least 12 hours notice.');
        }
        const scheduledStart = new Date(dto.scheduledStart);
        const scheduledEnd = new Date(dto.scheduledEnd);
        this.validateWindow(scheduledStart, scheduledEnd);
        await this.validateInstructorAvailability(booking.instructorProfileId, scheduledStart, scheduledEnd);
        await this.validateInstructorConflict(booking.instructorProfileId, scheduledStart, scheduledEnd, id);
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                scheduledStart,
                scheduledEnd,
                status: client_1.BookingStatus.RESCHEDULED,
                rescheduleReason: dto.reason,
            },
        });
        await this.auditService.log({
            actorUserId: actorUser?.userId,
            entityType: client_1.EntityType.BOOKING,
            entityId: id,
            action: 'BOOKING_RESCHEDULED',
            metadataJson: {
                previousStart: booking.scheduledStart,
                previousEnd: booking.scheduledEnd,
                scheduledStart,
                scheduledEnd,
                reason: dto.reason,
            },
        });
        return this.normalizeBooking(updated);
    }
    async listMineAsInstructor(userId) {
        const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
        if (!instructor) {
            throw new common_1.NotFoundException('Instructor profile not found.');
        }
        return this.list({ instructorProfileId: instructor.id });
    }
    async findOne(id, userId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                lessons: true,
                package: true,
                candidateProfile: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                instructorProfile: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!booking) {
            return null;
        }
        await this.assertBookingAccess(booking, userId, role);
        return this.normalizeBooking(booking);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        packages_service_1.PackagesService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map