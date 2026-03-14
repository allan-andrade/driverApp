export type UserRole = 'ADMIN' | 'CANDIDATE' | 'INSTRUCTOR' | 'SCHOOL_MANAGER';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type InstructorType = 'AUTONOMO' | 'SCHOOL_LINKED';

export type CnhCategory = 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';

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
