export type UserRole = 'ADMIN' | 'CANDIDATE' | 'INSTRUCTOR' | 'SCHOOL_MANAGER';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface InstructorCard {
  id: string;
  fullName: string;
  city: string;
  state: string;
  basePrice: number;
  rating: number;
  verificationStatus: VerificationStatus;
  instructorType: 'AUTONOMO' | 'SCHOOL_LINKED';
  categories: string[];
  hasAvailability: boolean;
}
