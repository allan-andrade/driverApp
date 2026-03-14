export declare class UpsertStatePolicyDto {
    stateCode: string;
    isActive: boolean;
    rulesJson: Record<string, unknown>;
    examFlowJson: Record<string, unknown>;
    docsJson: Record<string, unknown>;
    notes?: string;
}
