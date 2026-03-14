import {
  BookingStatus,
  CnhCategory,
  DisputeStatus,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
  InstructorType,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  PayoutStatus,
  PrismaClient,
  UserRole,
  UserStatus,
  VerificationStatus,
  WalletOwnerType,
  WalletTransactionType,
  DocumentReviewDecision,
  PaymentAttemptStatus,
  PaymentSplitStatus,
  RecipientType,
  ChatMessageType,
  LessonLocationEventType,
  ReminderChannel,
  ReminderType,
  FraudSeverity,
  FraudSignalType,
  WebhookProvider,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.reminderJobLog.deleteMany();
  await prisma.lessonLocationEvent.deleteMany();
  await prisma.fraudSignal.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.paymentSplit.deleteMany();
  await prisma.paymentAttempt.deleteMany();
  await prisma.matchingSnapshot.deleteMany();
  await prisma.documentReview.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.instructorMetrics.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.incidentReport.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.documentSubmission.deleteMany();
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
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '11900000001',
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate@driverschool.local',
      passwordHash,
      role: UserRole.CANDIDATE,
      status: UserStatus.ACTIVE,
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
      role: UserRole.INSTRUCTOR,
      status: UserStatus.ACTIVE,
      phone: '11900000003',
    },
  });

  const instructorProfile = await prisma.instructorProfile.create({
    data: {
      userId: instructorUser.id,
      instructorType: InstructorType.AUTONOMO,
      verificationStatus: VerificationStatus.APPROVED,
      bio: 'Instrutor premium focado em primeira habilitacao e preparo para prova pratica.',
      yearsExperience: 9,
      serviceRadiusKm: 22,
      basePrice: 140,
      isActive: true,
      categories: [CnhCategory.B],
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
      categorySupported: CnhCategory.B,
      verificationStatus: VerificationStatus.APPROVED,
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
      category: CnhCategory.B,
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
      category: CnhCategory.B,
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
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PENDING,
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
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const upcomingLesson = await prisma.lesson.create({
    data: {
      bookingId: upcomingBooking.id,
      candidateProfileId: candidateProfile.id,
      instructorProfileId: instructorProfile.id,
      pinCode: '1234',
      pinVerified: false,
      status: 'SCHEDULED',
    },
  });

  const completedLesson = await prisma.lesson.create({
    data: {
      bookingId: completedBooking.id,
      candidateProfileId: candidateProfile.id,
      instructorProfileId: instructorProfile.id,
      pinCode: '5678',
      pinVerified: true,
      status: 'COMPLETED',
      startedAt: new Date(completedStart.getTime() + 5 * 60 * 1000),
      finishedAt: completedEnd,
      startLat: -23.561414,
      startLng: -46.655881,
      endLat: -23.56818,
      endLng: -46.644312,
    },
  });

  await prisma.payment.createMany({
    data: [
      {
        bookingId: upcomingBooking.id,
        candidateProfileId: candidateProfile.id,
        instructorProfileId: instructorProfile.id,
        status: PaymentStatus.PENDING,
        amount: 590,
        platformFee: 70.8,
        method: PaymentMethod.MANUAL,
        currency: 'BRL',
        provider: 'stub',
      },
      {
        bookingId: completedBooking.id,
        candidateProfileId: candidateProfile.id,
        instructorProfileId: instructorProfile.id,
        status: PaymentStatus.PAID,
        amount: 390,
        platformFee: 46.8,
        method: PaymentMethod.CARD,
        currency: 'BRL',
        capturedAt: completedEnd,
        provider: 'stub',
      },
    ],
  });

  const completedPayment = await prisma.payment.findFirstOrThrow({
    where: { bookingId: completedBooking.id },
  });

  await prisma.payout.create({
    data: {
      paymentId: completedPayment.id,
      instructorProfileId: instructorProfile.id,
      amountNet: 343.2,
      status: PayoutStatus.PAID,
      scheduledAt: new Date(completedEnd.getTime() + 24 * 60 * 60 * 1000),
      paidAt: new Date(completedEnd.getTime() + 48 * 60 * 60 * 1000),
      provider: 'stub-bank',
    },
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

  await prisma.review.createMany({
    data: [
      {
        bookingId: completedBooking.id,
        candidateProfileId: candidateProfile.id,
        instructorProfileId: instructorProfile.id,
        punctuality: 4,
        didactics: 5,
        professionalism: 5,
        safety: 5,
        examReadiness: 5,
        comment: 'Instrutor bem didatico e pontual.',
      },
      {
        bookingId: completedBooking.id,
        candidateProfileId: candidateProfile.id,
        instructorProfileId: instructorProfile.id,
        punctuality: 5,
        didactics: 4,
        professionalism: 5,
        safety: 5,
        examReadiness: 4,
        comment: 'Boa preparacao para prova, com simulacoes uteis.',
      },
    ],
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@driverschool.local',
      passwordHash,
      role: UserRole.SCHOOL_MANAGER,
      status: UserStatus.ACTIVE,
      phone: '11900000004',
    },
  });

  const school = await prisma.school.create({
    data: {
      legalName: 'Centro de Formacao Prime LTDA',
      tradeName: 'Auto Escola Prime',
      cnpj: '12345678000199',
      verificationStatus: VerificationStatus.APPROVED,
      address: 'Av Paulista, 1000',
      city: 'Sao Paulo',
      state: 'SP',
      managerUserId: managerUser.id,
    },
  });

  const submission = await prisma.documentSubmission.create({
    data: {
      userId: candidateUser.id,
      stateCode: 'SP',
      documentType: 'CPF',
      fileUrl: 'https://example.com/docs/cpf-candidato.pdf',
      verificationStatus: VerificationStatus.PENDING,
    },
  });

  await prisma.dispute.create({
    data: {
      bookingId: completedBooking.id,
      lessonId: completedLesson.id,
      paymentId: completedPayment.id,
      openedByUserId: candidateUser.id,
      reason: 'Cobrança indevida de taxa adicional',
      description: 'Valor cobrado no recibo nao bate com o combinado no app.',
      status: DisputeStatus.OPEN,
    },
  });

  await prisma.incidentReport.create({
    data: {
      bookingId: upcomingBooking.id,
      lessonId: upcomingLesson.id,
      reporterUserId: instructorUser.id,
      reportedUserId: candidateUser.id,
      type: IncidentType.NO_SHOW,
      severity: IncidentSeverity.MEDIUM,
      description: 'Aluno nao compareceu ao ponto de encontro no horario combinado.',
      status: IncidentStatus.OPEN,
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
      actorUserId: school.managerUserId,
      entityType: 'DOCUMENT_SUBMISSION',
      entityId: submission.id,
      action: 'SEED_DOCUMENT_SUBMISSION_CREATED',
      metadataJson: { source: 'seed' },
    },
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

  const metrics = await prisma.instructorMetrics.create({
    data: {
      instructorProfileId: instructorProfile.id,
      averageRating: 4.7,
      punctualityAvg: 4.67,
      didacticsAvg: 4.67,
      professionalismAvg: 5,
      safetyAvg: 5,
      examReadinessAvg: 4.33,
      totalReviews: 3,
      completedLessons: 1,
      cancelledBookings: 0,
      noShowCount: 0,
      attendanceRate: 100,
      completionRate: 100,
      trustScore: 91.5,
      teachingScore: 88.2,
      marketplaceScore: 90.4,
    },
  });

  const instructorWallet = await prisma.wallet.create({
    data: {
      ownerType: WalletOwnerType.INSTRUCTOR,
      instructorProfileId: instructorProfile.id,
      currency: 'BRL',
      balanceAvailable: 343.2,
      balancePending: 519.2,
      balanceOnHold: 0,
    },
  });

  await prisma.walletTransaction.createMany({
    data: [
      {
        walletId: instructorWallet.id,
        type: WalletTransactionType.CREDIT,
        amount: 343.2,
        referenceType: 'PAYMENT',
        referenceId: completedPayment.id,
        description: 'Credito de pagamento capturado',
      },
      {
        walletId: instructorWallet.id,
        type: WalletTransactionType.RELEASE,
        amount: 343.2,
        referenceType: 'PAYMENT',
        referenceId: completedPayment.id,
        description: 'Liberacao para saldo disponivel',
      },
    ],
  });

  await prisma.paymentAttempt.createMany({
    data: [
      {
        paymentId: completedPayment.id,
        provider: WebhookProvider.STRIPE,
        providerReference: `seed_pi_${completedPayment.id}`,
        status: PaymentAttemptStatus.SUCCESS,
        requestJson: { amount: 390, currency: 'BRL' },
        responseJson: { status: 'succeeded' },
      },
    ],
  });

  await prisma.paymentSplit.createMany({
    data: [
      {
        paymentId: completedPayment.id,
        recipientType: RecipientType.PLATFORM,
        recipientId: 'platform',
        amount: 46.8,
        status: PaymentSplitStatus.PAID,
      },
      {
        paymentId: completedPayment.id,
        recipientType: RecipientType.INSTRUCTOR,
        recipientId: instructorProfile.id,
        amount: 343.2,
        status: PaymentSplitStatus.PAID,
      },
    ],
  });

  const chatConversation = await prisma.chatConversation.create({
    data: {
      bookingId: upcomingBooking.id,
      candidateProfileId: candidateProfile.id,
      instructorProfileId: instructorProfile.id,
      lastMessageAt: new Date(),
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId: chatConversation.id,
        senderUserId: candidateUser.id,
        type: ChatMessageType.TEXT,
        content: 'Ola professor, podemos confirmar o local de encontro?',
      },
      {
        conversationId: chatConversation.id,
        senderUserId: instructorUser.id,
        type: ChatMessageType.TEXT,
        content: 'Claro, encontro em frente ao shopping as 13:45.',
      },
    ],
  });

  await prisma.lessonLocationEvent.createMany({
    data: [
      {
        lessonId: completedLesson.id,
        eventType: LessonLocationEventType.START,
        lat: -23.561414,
        lng: -46.655881,
        address: 'Ponto de partida seed',
      },
      {
        lessonId: completedLesson.id,
        eventType: LessonLocationEventType.FINISH,
        lat: -23.56818,
        lng: -46.644312,
        address: 'Ponto final seed',
      },
    ],
  });

  await prisma.reminderJobLog.createMany({
    data: [
      {
        userId: candidateUser.id,
        bookingId: upcomingBooking.id,
        lessonId: upcomingLesson.id,
        type: ReminderType.LESSON_REMINDER,
        channel: ReminderChannel.IN_APP,
        status: 'SENT',
        processedAt: new Date(),
      },
      {
        userId: instructorUser.id,
        bookingId: upcomingBooking.id,
        lessonId: upcomingLesson.id,
        type: ReminderType.LESSON_REMINDER,
        channel: ReminderChannel.IN_APP,
        status: 'SENT',
        processedAt: new Date(),
      },
    ],
  });

  await prisma.fraudSignal.create({
    data: {
      userId: candidateUser.id,
      paymentId: completedPayment.id,
      bookingId: completedBooking.id,
      signalType: FraudSignalType.OTHER,
      severity: FraudSeverity.LOW,
      score: 15,
      description: 'Seed baseline signal for risk dashboard.',
      metadataJson: { source: 'seed' },
    },
  });

  await prisma.webhookEvent.create({
    data: {
      provider: WebhookProvider.STRIPE,
      eventType: 'payment_intent.succeeded',
      providerReference: `seed_evt_${completedPayment.id}`,
      payloadJson: { id: `seed_evt_${completedPayment.id}`, type: 'payment_intent.succeeded' },
      processed: true,
      processedAt: new Date(),
    },
  });

  await prisma.notificationPreference.createMany({
    data: [
      { userId: candidateUser.id, inAppEnabled: true, bookingUpdates: true, lessonUpdates: true, paymentUpdates: true, safetyAlerts: true },
      { userId: instructorUser.id, inAppEnabled: true, bookingUpdates: true, lessonUpdates: true, paymentUpdates: true, safetyAlerts: true },
      { userId: managerUser.id, inAppEnabled: true, bookingUpdates: true, lessonUpdates: true, paymentUpdates: true, safetyAlerts: true },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: candidateUser.id,
        type: NotificationType.BOOKING_CREATED,
        title: 'Reserva criada',
        message: 'Sua reserva foi criada com sucesso.',
        payloadJson: { bookingId: upcomingBooking.id },
      },
      {
        userId: instructorUser.id,
        type: NotificationType.LESSON_COMPLETED,
        title: 'Aula concluida',
        message: 'Uma aula foi concluida e entrou no seu historico.',
        payloadJson: { lessonId: completedLesson.id },
      },
      {
        userId: managerUser.id,
        type: NotificationType.DOCUMENT_REVIEWED,
        title: 'Documento revisado',
        message: 'Uma submissao documental recebeu revisao.',
        payloadJson: { submissionId: submission.id },
      },
    ],
  });

  const docReview = await prisma.documentReview.create({
    data: {
      documentSubmissionId: submission.id,
      reviewedByUserId: managerUser.id,
      decision: DocumentReviewDecision.REQUEST_CHANGES,
      reason: 'Necessario enviar arquivo em melhor qualidade.',
      metadataJson: { source: 'seed' },
    },
  });

  await prisma.matchingSnapshot.create({
    data: {
      candidateProfileId: candidateProfile.id,
      instructorProfileId: instructorProfile.id,
      score: 92.7,
      factorsJson: {
        trustScore: 91.5,
        teachingScore: 88.2,
        cityMatch: 1,
        stateMatch: 1,
        categoryMatch: 1,
      },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorUserId: instructorUser.id,
        entityType: 'INSTRUCTOR_METRICS',
        entityId: metrics.id,
        action: 'SEED_METRICS_CREATED',
        metadataJson: { source: 'seed' },
      },
      {
        actorUserId: managerUser.id,
        entityType: 'DOCUMENT_REVIEW',
        entityId: docReview.id,
        action: 'SEED_DOCUMENT_REVIEW_CREATED',
        metadataJson: { source: 'seed' },
      },
    ],
  });

  console.log('Seed phase 5 executed with success');
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
