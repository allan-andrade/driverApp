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
    await prisma.availabilitySlot.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.package.deleteMany();
    await prisma.instructorSchoolLink.deleteMany();
    await prisma.candidateProfile.deleteMany();
    await prisma.instructorProfile.deleteMany();
    await prisma.school.deleteMany();
    await prisma.documentRequirement.deleteMany();
    await prisma.statePolicy.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash('12345678', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@driverschool.app',
            passwordHash,
            role: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000001',
        },
    });
    const candidatesUsers = await Promise.all(['ana', 'bruno', 'carla'].map((name, idx) => prisma.user.create({
        data: {
            email: `${name}@driverschool.app`,
            passwordHash,
            role: client_1.UserRole.CANDIDATE,
            status: client_1.UserStatus.ACTIVE,
            phone: `1190000001${idx + 2}`,
        },
    })));
    const candidateProfiles = await Promise.all(candidatesUsers.map((user, idx) => prisma.candidateProfile.create({
        data: {
            userId: user.id,
            fullName: `Candidato ${idx + 1}`,
            cpf: `1112223334${idx}`,
            birthDate: new Date(1998, idx + 1, 10),
            state: 'SP',
            city: idx === 0 ? 'Sao Paulo' : 'Campinas',
            targetCategory: client_1.CnhCategory.B,
            learningStage: idx === 2 ? client_1.LearningStage.PRE_EXAM : client_1.LearningStage.BEGINNER,
            hasVehicle: idx % 2 === 0,
            preferredLanguage: 'pt-BR',
        },
    })));
    const instructorUsers = await Promise.all(['igor', 'juliana', 'marcos'].map((name, idx) => prisma.user.create({
        data: {
            email: `${name}@driverschool.app`,
            passwordHash,
            role: client_1.UserRole.INSTRUCTOR,
            status: client_1.UserStatus.ACTIVE,
            phone: `2190000001${idx + 5}`,
        },
    })));
    const instructors = await Promise.all(instructorUsers.map((user, idx) => prisma.instructorProfile.create({
        data: {
            userId: user.id,
            instructorType: idx === 0 ? client_1.InstructorType.AUTONOMO : client_1.InstructorType.SCHOOL_LINKED,
            verificationStatus: idx === 2 ? client_1.VerificationStatus.PENDING : client_1.VerificationStatus.APPROVED,
            bio: `Instrutor com foco em seguranca e preparacao para exame pratico ${idx + 1}.`,
            yearsExperience: 4 + idx,
            serviceRadiusKm: 10 + idx * 5,
            basePrice: 95 + idx * 15,
            isActive: true,
            categories: [client_1.CnhCategory.B],
            city: idx === 2 ? 'Rio de Janeiro' : 'Sao Paulo',
            state: idx === 2 ? 'RJ' : 'SP',
        },
    })));
    const instructor1 = instructors[0];
    const instructor2 = instructors[1];
    const instructor3 = instructors[2];
    const candidate1 = candidateProfiles[0];
    const candidate2 = candidateProfiles[1];
    const managerUser = await prisma.user.create({
        data: {
            email: 'gestor@escolaprime.app',
            passwordHash,
            role: client_1.UserRole.SCHOOL_MANAGER,
            status: client_1.UserStatus.ACTIVE,
            phone: '11900000999',
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
    await prisma.instructorSchoolLink.createMany({
        data: [
            {
                instructorProfileId: instructor2.id,
                schoolId: school.id,
                status: client_1.LinkStatus.ACTIVE,
            },
            {
                instructorProfileId: instructor3.id,
                schoolId: school.id,
                status: client_1.LinkStatus.PENDING,
            },
        ],
    });
    await prisma.vehicle.createMany({
        data: [
            {
                instructorProfileId: instructor1.id,
                plate: 'ABC1D23',
                brand: 'Toyota',
                model: 'Yaris',
                year: 2023,
                transmissionType: 'MANUAL',
                categorySupported: client_1.CnhCategory.B,
                verificationStatus: client_1.VerificationStatus.APPROVED,
            },
            {
                instructorProfileId: instructor2.id,
                plate: 'EFG4H56',
                brand: 'Honda',
                model: 'City',
                year: 2022,
                transmissionType: 'AUTOMATIC',
                categorySupported: client_1.CnhCategory.B,
                verificationStatus: client_1.VerificationStatus.APPROVED,
            },
            {
                schoolId: school.id,
                plate: 'IJK7L89',
                brand: 'Chevrolet',
                model: 'Onix',
                year: 2021,
                transmissionType: 'MANUAL',
                categorySupported: client_1.CnhCategory.B,
                verificationStatus: client_1.VerificationStatus.PENDING,
            },
        ],
    });
    await prisma.availabilitySlot.createMany({
        data: [
            { instructorProfileId: instructor1.id, weekday: 1, startTime: '08:00', endTime: '12:00', isActive: true },
            { instructorProfileId: instructor1.id, weekday: 3, startTime: '14:00', endTime: '18:00', isActive: true },
            { instructorProfileId: instructor2.id, weekday: 2, startTime: '09:00', endTime: '13:00', isActive: true },
            { instructorProfileId: instructor3.id, weekday: 4, startTime: '10:00', endTime: '16:00', isActive: true },
        ],
    });
    const starterPackage = await prisma.package.create({
        data: {
            instructorProfileId: instructor1.id,
            title: 'Pacote Inicio Seguro',
            lessonCount: 5,
            durationMinutes: 50,
            category: client_1.CnhCategory.B,
            price: 450,
            usesInstructorVehicle: true,
        },
    });
    const booking1 = await prisma.booking.create({
        data: {
            candidateProfileId: candidate1.id,
            instructorProfileId: instructor1.id,
            packageId: starterPackage.id,
            scheduledStart: new Date('2026-03-20T10:00:00.000Z'),
            scheduledEnd: new Date('2026-03-20T10:50:00.000Z'),
            priceTotal: 90,
            platformFee: 9,
            status: client_1.BookingStatus.CONFIRMED,
            paymentStatus: 'PENDING',
        },
    });
    const booking2 = await prisma.booking.create({
        data: {
            candidateProfileId: candidate2.id,
            schoolId: school.id,
            instructorProfileId: instructor2.id,
            scheduledStart: new Date('2026-03-18T14:00:00.000Z'),
            scheduledEnd: new Date('2026-03-18T14:50:00.000Z'),
            priceTotal: 110,
            platformFee: 11,
            status: client_1.BookingStatus.CONFIRMED,
            paymentStatus: 'PAID',
        },
    });
    await prisma.lesson.createMany({
        data: [
            {
                bookingId: booking1.id,
                candidateProfileId: candidate1.id,
                instructorProfileId: instructor1.id,
                pinCode: '1234',
                pinVerified: false,
                status: 'SCHEDULED',
            },
            {
                bookingId: booking2.id,
                candidateProfileId: candidate2.id,
                instructorProfileId: instructor2.id,
                pinCode: '9876',
                pinVerified: true,
                startedAt: new Date('2026-03-18T14:00:00.000Z'),
                finishedAt: new Date('2026-03-18T14:50:00.000Z'),
                status: 'COMPLETED',
            },
        ],
    });
    await prisma.review.create({
        data: {
            bookingId: booking2.id,
            candidateProfileId: candidate2.id,
            instructorProfileId: instructor2.id,
            punctuality: 5,
            didactics: 4,
            professionalism: 5,
            safety: 5,
            examReadiness: 4,
            comment: 'Aula muito clara e objetiva.',
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
    await prisma.documentRequirement.createMany({
        data: [
            {
                entityType: 'CANDIDATE_PROFILE',
                stateCode: 'SP',
                name: 'Comprovante de residencia',
                required: true,
                metadataJson: { maxAgeDays: 90 },
            },
            {
                entityType: 'INSTRUCTOR_PROFILE',
                stateCode: 'RJ',
                name: 'Credencial de instrutor',
                required: true,
                metadataJson: { issuingAuthority: 'DETRAN' },
            },
        ],
    });
    await prisma.auditLog.create({
        data: {
            actorUserId: admin.id,
            entityType: 'STATE_POLICY',
            entityId: 'SP',
            action: 'SEED_CREATED',
            metadataJson: { source: 'seed' },
        },
    });
    console.log('Seed executed with success');
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