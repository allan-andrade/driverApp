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
exports.CandidatesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const candidates_service_1 = require("./candidates.service");
const upsert_candidate_dto_1 = require("./dto/upsert-candidate.dto");
let CandidatesController = class CandidatesController {
    candidatesService;
    constructor(candidatesService) {
        this.candidatesService = candidatesService;
    }
    upsertMe(userId, dto) {
        return this.candidatesService.upsertByUser(userId, dto);
    }
    me(userId) {
        return this.candidatesService.findMe(userId);
    }
    list() {
        return this.candidatesService.list();
    }
};
exports.CandidatesController = CandidatesController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE),
    (0, common_1.Post)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_candidate_dto_1.UpsertCandidateDto]),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "upsertMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "me", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CandidatesController.prototype, "list", null);
exports.CandidatesController = CandidatesController = __decorate([
    (0, common_1.Controller)('candidates'),
    __metadata("design:paramtypes", [candidates_service_1.CandidatesService])
], CandidatesController);
//# sourceMappingURL=candidates.controller.js.map