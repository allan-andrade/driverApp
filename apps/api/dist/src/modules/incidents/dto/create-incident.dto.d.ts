import { IncidentSeverity, IncidentType } from '@prisma/client';
export declare class CreateIncidentDto {
    bookingId?: string;
    lessonId?: string;
    reportedUserId?: string;
    type: IncidentType;
    severity: IncidentSeverity;
    description: string;
    evidenceUrl?: string;
}
