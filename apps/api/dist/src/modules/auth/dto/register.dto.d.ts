export declare enum RegisterRole {
    CANDIDATE = "CANDIDATE",
    INSTRUCTOR = "INSTRUCTOR",
    SCHOOL_MANAGER = "SCHOOL_MANAGER"
}
export declare class RegisterDto {
    email: string;
    phone?: string;
    password: string;
    role: RegisterRole;
}
