import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { SearchMarketplaceDto } from './dto/search-marketplace.dto';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace/instructors')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Public()
  @Get()
  list(@Query() query: SearchMarketplaceDto) {
    return this.marketplaceService.listInstructors(query);
  }

  @Public()
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.marketplaceService.getInstructorDetail(id);
  }

  @Public()
  @Get(':id/availability')
  availability(@Param('id') id: string) {
    return this.marketplaceService.getInstructorAvailability(id);
  }

  @Public()
  @Get(':id/reviews')
  reviews(@Param('id') id: string) {
    return this.marketplaceService.getInstructorReviews(id);
  }

  @Public()
  @Get(':id/packages')
  packages(@Param('id') id: string) {
    return this.marketplaceService.getInstructorPackages(id);
  }
}
