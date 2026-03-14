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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const search_marketplace_dto_1 = require("./dto/search-marketplace.dto");
const marketplace_service_1 = require("./marketplace.service");
let MarketplaceController = class MarketplaceController {
    marketplaceService;
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    list(query) {
        return this.marketplaceService.listInstructors(query);
    }
    detail(id) {
        return this.marketplaceService.getInstructorDetail(id);
    }
    availability(id) {
        return this.marketplaceService.getInstructorAvailability(id);
    }
    reviews(id) {
        return this.marketplaceService.getInstructorReviews(id);
    }
    packages(id) {
        return this.marketplaceService.getInstructorPackages(id);
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_marketplace_dto_1.SearchMarketplaceDto]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "detail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/availability'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "availability", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "reviews", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/packages'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "packages", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace/instructors'),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map