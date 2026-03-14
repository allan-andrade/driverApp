export type UserRole = 'ADMIN' | 'CANDIDATE' | 'INSTRUCTOR' | 'SCHOOL_MANAGER';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
export type DocumentReviewDecision = 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES';

export type InstructorType = 'AUTONOMO' | 'SCHOOL_LINKED';

export type CnhCategory = 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'FAILED';
export type PaymentMethod = 'PIX' | 'CARD' | 'CASH' | 'MANUAL';
export type WalletTransactionType = 'CREDIT' | 'DEBIT' | 'HOLD' | 'RELEASE' | 'REFUND' | 'PAYOUT';
export type NotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'LESSON_REMINDER'
  | 'LESSON_STARTED'
  | 'LESSON_COMPLETED'
  | 'PAYMENT_UPDATED'
  | 'PAYOUT_UPDATED'
  | 'DOCUMENT_REVIEWED'
  | 'INCIDENT_UPDATED'
  | 'DISPUTE_UPDATED'
  | 'SYSTEM';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface InstructorCard {
  id: string;
  fullName: string;
  city: string | null;
  state: string | null;
  basePrice: number | null;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  instructorType: InstructorType;
  categories: CnhCategory[];
  hasAvailability: boolean;
  yearsExperience: number | null;
  minPackagePrice: number | null;
  vehicleCount: number;
  relevanceScore: number;
  trustScore: number;
  teachingScore: number;
  marketplaceScore: number;
  rankingFactors?: Record<string, unknown>;
}

export interface InstructorMetrics {
  id: string;
  instructorProfileId: string;
  averageRating: number;
  punctualityAvg: number;
  didacticsAvg: number;
  professionalismAvg: number;
  safetyAvg: number;
  examReadinessAvg: number;
  totalReviews: number;
  completedLessons: number;
  cancelledBookings: number;
  noShowCount: number;
  attendanceRate: number;
  completionRate: number;
  trustScore: number;
  teachingScore: number;
  marketplaceScore: number;
  updatedAt: string;
}

export interface MarketplaceListResponse {
  items: InstructorCard[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface InstructorVehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  transmissionType: TransmissionType;
  categorySupported: CnhCategory;
  verificationStatus: VerificationStatus;
}

export interface InstructorAvailability {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface InstructorPackage {
  id: string;
  title: string;
  lessonCount: number;
  durationMinutes: number;
  category: CnhCategory;
  price: number;
  usesInstructorVehicle: boolean;
}

export interface MarketplaceInstructorDetail {
  id: string;
  fullName: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  yearsExperience: number | null;
  serviceRadiusKm: number | null;
  basePrice: number | null;
  instructorType: InstructorType;
  verificationStatus: VerificationStatus;
  categories: CnhCategory[];
  trustScore: number;
  teachingScore: number;
  marketplaceScore: number;
  stats: {
    rating: number;
    reviewCount: number;
    packageCount: number;
    vehicleCount: number;
    hasAvailability: boolean;
  };
  vehicles: InstructorVehicle[];
  packages: InstructorPackage[];
  availability: InstructorAvailability[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  payloadJson?: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  bookingUpdates: boolean;
  lessonUpdates: boolean;
  paymentUpdates: boolean;
  safetyAlerts: boolean;
  marketingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  ownerType: 'USER' | 'INSTRUCTOR' | 'SCHOOL';
  currency: string;
  balanceAvailable: number;
  balancePending: number;
  balanceOnHold: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  currency: string;
  referenceType: string;
  referenceId: string;
  description: string | null;
  createdAt: string;
}

export interface CandidateAnalytics {
  summary: {
    upcomingLessons: number;
    completedLessons: number;
    cancelledBookings: number;
    progress: number;
  };
  recentBookings: BookingListItem[];
  matching: Array<{
    id: string;
    score: number;
    instructorProfile: {
      id: string;
      user: { email: string };
      city: string | null;
      state: string | null;
    };
  }>;
}

export interface InstructorAnalytics {
  summary: {
    bookingsTotal: number;
    completedLessons: number;
    cancelledBookings: number;
    noShows: number;
    avgRating: number;
    trustScore: number;
    teachingScore: number;
    agendaOccupancy: number;
  };
  revenue: {
    gross: number;
    pending: number;
    available: number;
  };
}

export interface SchoolAnalytics {
  summary: {
    linkedInstructors: number;
    totalBookings: number;
    completedLessons: number;
    documentPendencies: number;
  };
  revenue: {
    aggregated: number;
    pending: number;
    available: number;
  };
}

export interface AdminOverviewAnalytics {
  totals: {
    totalUsers: number;
    totalInstructors: number;
    totalSchools: number;
    totalBookings: number;
    totalLessons: number;
    incidentsOpen: number;
    disputesOpen: number;
    documentsPending: number;
  };
  paymentsByStatus: Array<{
    status: string;
    _count: { status: number };
  }>;
}

export interface MarketplaceReview {
  id: string;
  candidateName: string;
  comment: string | null;
  punctuality: number;
  didactics: number;
  professionalism: number;
  safety: number;
  examReadiness: number;
  average: number;
  createdAt: string;
}

export interface BookingListItem {
  id: string;
  status: BookingStatus;
  scheduledStart: string;
  scheduledEnd: string;
  priceTotal: number;
  platformFee: number;
  candidateProfile: {
    id: string;
    fullName: string;
  };
  instructorProfile: {
    id: string;
    user: {
      email: string;
    };
  } | null;
  package: {
    id: string;
    title: string;
  } | null;
}

export type PaymentAttemptStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
export type PaymentSplitStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'ON_HOLD';
export type RecipientType = 'PLATFORM' | 'INSTRUCTOR' | 'SCHOOL';
export type WebhookProvider = 'STRIPE' | 'PAGARME' | 'ASAAS';
export type ReminderType = 'BOOKING_REMINDER' | 'LESSON_REMINDER' | 'PAYMENT_CONFIRMATION' | 'DOCUMENT_REMINDER';
export type ReminderChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
export type ChatMessageType = 'TEXT' | 'SYSTEM' | 'BOOKING_UPDATE';
export type LessonLocationEventType = 'CHECK_IN' | 'START' | 'FINISH' | 'MANUAL_MARK';
export type FraudSignalType =
  | 'MULTIPLE_CANCELS'
  | 'HIGH_RISK_PAYMENT'
  | 'DEVICE_MISMATCH'
  | 'GEO_MISMATCH'
  | 'DUPLICATE_ACCOUNT'
  | 'ABNORMAL_BOOKING_PATTERN'
  | 'OTHER';
export type FraudSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PaymentAttempt {
  id: string;
  paymentId: string;
  provider: WebhookProvider;
  providerReference: string | null;
  status: PaymentAttemptStatus;
  requestJson?: Record<string, unknown>;
  responseJson?: Record<string, unknown>;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSplit {
  id: string;
  paymentId: string;
  recipientType: RecipientType;
  recipientId: string;
  amount: number;
  feeAmount: number;
  status: PaymentSplitStatus;
  providerReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  paymentId: string;
  provider: string;
  providerPaymentId: string;
  providerReference: string;
  checkoutUrl: string | null;
  status: PaymentStatus;
}

export interface ChatConversation {
  id: string;
  bookingId: string | null;
  candidateProfileId: string | null;
  instructorProfileId: string | null;
  schoolId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  type: ChatMessageType;
  content: string;
  metadataJson?: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface LessonLocationEvent {
  id: string;
  lessonId: string;
  eventType: LessonLocationEventType;
  lat: number;
  lng: number;
  accuracy: number | null;
  address: string | null;
  recordedAt: string;
  createdAt: string;
}

export interface ReminderJobLog {
  id: string;
  userId: string | null;
  bookingId: string | null;
  lessonId: string | null;
  type: ReminderType;
  channel: ReminderChannel;
  status: string;
  payloadJson?: Record<string, unknown>;
  processedAt: string | null;
  createdAt: string;
}

export interface FraudSignal {
  id: string;
  userId: string | null;
  paymentId: string | null;
  bookingId: string | null;
  lessonId: string | null;
  signalType: FraudSignalType;
  severity: FraudSeverity;
  score: number;
  description: string | null;
  metadataJson?: Record<string, unknown>;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: WebhookProvider;
  eventType: string;
  providerReference: string | null;
  payloadJson: Record<string, unknown>;
  processed: boolean;
  processedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface AdminOperationsAnalytics {
  finance: {
    totalPayments: number;
    grossAmount: number;
    platformRevenue: number;
    splits: Array<{ status: PaymentSplitStatus; count: number; amount: number }>;
    payouts: Array<{ status: string; count: number; amount: number }>;
    attempts: Array<{ status: PaymentAttemptStatus; count: number }>;
  };
  webhooks: Array<{ provider: WebhookProvider; processed: boolean; count: number }>;
  fraud: {
    summary: Array<{ severity: FraudSeverity; count: number; averageScore: number }>;
    recent: FraudSignal[];
  };
}
