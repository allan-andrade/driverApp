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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const compliance_service_1 = require("./compliance.service");
const create_document_submission_dto_1 = require("./dto/create-document-submission.dto");
const create_document_requirement_dto_1 = require("./dto/create-document-requirement.dto");
const review_document_submission_dto_1 = require("./dto/review-document-submission.dto");
const upsert_state_policy_dto_1 = require("./dto/upsert-state-policy.dto");
let ComplianceController = class ComplianceController {
    complianceService;
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    upsertStatePolicy(dto) {
        return this.complianceService.upsertStatePolicy(dto);
    }
    listPolicies() {
        return this.complianceService.listPolicies();
    }
    createDocumentRequirement(dto) {
        return this.complianceService.createDocumentRequirement(dto);
    }
    listDocumentRequirements(stateCode) {
        return this.complianceService.listDocumentRequirements(stateCode);
    }
    createDocumentSubmission(userId, dto) {
        return this.complianceService.createDocumentSubmission(userId, dto);
    }
    listDocumentSubmissions(user) {
        return this.complianceService.listDocumentSubmissions(user.userId, user.role);
    }
    reviewDocumentSubmission(id, dto, actorUserId) {
        return this.complianceService.reviewDocumentSubmission(id, dto, actorUserId);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('state-policies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_state_policy_dto_1.UpsertStatePolicyDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "upsertStatePolicy", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('state-policies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "listPolicies", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Post)('document-requirements'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_requirement_dto_1.CreateDocumentRequirementDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "createDocumentRequirement", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('document-requirements'),
    __param(0, (0, common_1.Query)('stateCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "listDocumentRequirements", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Post)('submissions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_document_submission_dto_1.CreateDocumentSubmissionDto]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "createDocumentSubmission", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)('submissions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "listDocumentSubmissions", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Patch)('submissions/:id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_document_submission_dto_1.ReviewDocumentSubmissionDto, String]),
    __metadata("design:returntype", void 0)
], ComplianceController.prototype, "reviewDocumentSubmission", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, common_1.Controller)('compliance'),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map