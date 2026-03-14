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
exports.UpsertCandidateDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class UpsertCandidateDto {
    fullName;
    cpf;
    birthDate;
    state;
    city;
    targetCategory;
    learningStage;
    hasVehicle;
    preferredLanguage;
    preferredInstructorGender;
}
exports.UpsertCandidateDto = UpsertCandidateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CnhCategory),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "targetCategory", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.LearningStage),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "learningStage", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertCandidateDto.prototype, "hasVehicle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCandidateDto.prototype, "preferredInstructorGender", void 0);
//# sourceMappingURL=upsert-candidate.dto.js.map