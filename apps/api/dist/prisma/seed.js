"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.review.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.package.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.instructorSchoolLink.deleteMany();
    await prisma.documentRequirement.deleteMany();
    await prisma.candidateProfile.deleteMany();
    await prisma.instructorProfile.deleteMany();
    await prisma.school.deleteMany();
    await prisma.statePolicy.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash('Admin@123456', 10);
    await prisma.user.create({
        data: {
            email: 'admin@driverschool.local',
            passwordHash,
            role: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000001',
        },
    });
    const candidateUser = await prisma.user.create({
        data: {
            email: 'candidate@driverschool.local',
            passwordHash,
            role: client_1.UserRole.CANDIDATE,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000002',
        },
    });
    const candidateProfile = await prisma.candidateProfile.create({
        data: {
            userId: candidateUser.id,
            fullName: 'Candidato Seed',
            hasVehicle: false,
            state: 'SP',
            city: 'Sao Paulo',
            preferredLanguage: 'pt-BR',
        },
    });
    const instructorUser = await prisma.user.create({
        data: {
            email: 'instructor@driverschool.local',
            passwordHash,
            role: client_1.UserRole.INSTRUCTOR,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000003',
        },
    });
    const instructorProfile = await prisma.instructorProfile.create({
        data: {
            userId: instructorUser.id,
            instructorType: client_1.InstructorType.AUTONOMO,
            verificationStatus: client_1.VerificationStatus.APPROVED,
            bio: 'Instrutor premium focado em primeira habilitacao e preparo para prova pratica.',
            yearsExperience: 9,
            serviceRadiusKm: 22,
            basePrice: 140,
            isActive: true,
            categories: [client_1.CnhCategory.B],
            city: 'Sao Paulo',
            state: 'SP',
        },
    });
    await prisma.vehicle.create({
        data: {
            instructorProfileId: instructorProfile.id,
            plate: 'ABC1D23',
            brand: 'Toyota',
            model: 'Yaris',
            year: 2021,
            transmissionType: 'AUTOMATIC',
            categorySupported: client_1.CnhCategory.B,
            verificationStatus: client_1.VerificationStatus.APPROVED,
        },
    });
    await prisma.availabilitySlot.createMany({
        data: [
            {
                instructorProfileId: instructorProfile.id,
                weekday: 1,
                startTime: '08:00',
                endTime: '12:00',
                isActive: true,
            },
            {
                instructorProfileId: instructorProfile.id,
                weekday: 3,
                startTime: '14:00',
                endTime: '18:00',
                isActive: true,
            },
            {
                instructorProfileId: instructorProfile.id,
                weekday: 5,
                startTime: '09:00',
                endTime: '13:00',
                isActive: true,
            },
        ],
    });
    const introPackage = await prisma.package.create({
        data: {
            instructorProfileId: instructorProfile.id,
            title: 'Pacote Inicio Seguro',
            lessonCount: 5,
            durationMinutes: 50,
            category: client_1.CnhCategory.B,
            price: 590,
            usesInstructorVehicle: true,
        },
    });
    const examPackage = await prisma.package.create({
        data: {
            instructorProfileId: instructorProfile.id,
            title: 'Pacote Reta Final de Exame',
            lessonCount: 3,
            durationMinutes: 50,
            category: client_1.CnhCategory.B,
            price: 390,
            usesInstructorVehicle: true,
        },
    });
    const now = new Date();
    const upcomingStart = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    upcomingStart.setUTCHours(14, 0, 0, 0);
    const upcomingEnd = new Date(upcomingStart.getTime() + 50 * 60 * 1000);
    const completedStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    completedStart.setUTCHours(14, 0, 0, 0);
    const completedEnd = new Date(completedStart.getTime() + 50 * 60 * 1000);
    const upcomingBooking = await prisma.booking.create({
        data: {
            candidateProfileId: candidateProfile.id,
            instructorProfileId: instructorProfile.id,
            packageId: introPackage.id,
            scheduledStart: upcomingStart,
            scheduledEnd: upcomingEnd,
            priceTotal: 590,
            platformFee: 70.8,
            status: client_1.BookingStatus.CONFIRMED,
            paymentStatus: client_1.PaymentStatus.PENDING,
        },
    });
    const completedBooking = await prisma.booking.create({
        data: {
            candidateProfileId: candidateProfile.id,
            instructorProfileId: instructorProfile.id,
            packageId: examPackage.id,
            scheduledStart: completedStart,
            scheduledEnd: completedEnd,
            priceTotal: 390,
            platformFee: 46.8,
            status: client_1.BookingStatus.COMPLETED,
            paymentStatus: client_1.PaymentStatus.PAID,
        },
    });
    await prisma.payment.createMany({
        data: [
            {
                bookingId: upcomingBooking.id,
                status: client_1.PaymentStatus.PENDING,
                amount: 590,
                provider: 'stub',
            },
            {
                bookingId: completedBooking.id,
                status: client_1.PaymentStatus.PAID,
                amount: 390,
                provider: 'stub',
            },
        ],
    });
    await prisma.review.create({
        data: {
            bookingId: completedBooking.id,
            candidateProfileId: candidateProfile.id,
            instructorProfileId: instructorProfile.id,
            punctuality: 5,
            didactics: 5,
            professionalism: 5,
            safety: 5,
            examReadiness: 4,
            comment: 'Aulas claras, objetivas e com foco no exame pratico.',
        },
    });
    const managerUser = await prisma.user.create({
        data: {
            email: 'manager@driverschool.local',
            passwordHash,
            role: client_1.UserRole.SCHOOL_MANAGER,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000004',
        },
    });
    const school = await prisma.school.create({
        data: {
            legalName: 'Centro de Formacao Prime LTDA',
            tradeName: 'Auto Escola Prime',
            cnpj: '12345678000199',
            verificationStatus: client_1.VerificationStatus.APPROVED,
            address: 'Av Paulista, 1000',
            city: 'Sao Paulo',
            state: 'SP',
            managerUserId: managerUser.id,
        },
    });
    await prisma.statePolicy.createMany({
        data: [
            {
                stateCode: 'SP',
                isActive: true,
                rulesJson: { minimumAge: 18, categoryBMinClasses: 20 },
                examFlowJson: { steps: ['medical', 'theory', 'practical'] },
                docsJson: { required: ['RG', 'CPF', 'Comprovante de endereco'] },
                notes: 'Politica inicial para Sao Paulo',
            },
            {
                stateCode: 'RJ',
                isActive: true,
                rulesJson: { minimumAge: 18, categoryBMinClasses: 20 },
                examFlowJson: { steps: ['medical', 'theory', 'practical'] },
                docsJson: { required: ['RG', 'CPF', 'Comprovante de endereco'] },
                notes: 'Politica inicial para Rio de Janeiro',
            },
        ],
    });
    await prisma.auditLog.create({
        data: {
            actorUserId: null,
            entityType: 'STATE_POLICY',
            entityId: 'SP',
            action: 'SEED_CREATED',
            metadataJson: { source: 'seed' },
        },
    });
    console.log('Seed phase 2 executed with success');
}
main()
    .catch(async (error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map