import { Module } from '@nestjs/common';
import { ComplianceModule } from '../compliance/compliance.module';
import { InstructorsModule } from '../instructors/instructors.module';
import { SchoolsModule } from '../schools/schools.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, InstructorsModule, SchoolsModule, ComplianceModule],
  controllers: [AdminController],
})
export class AdminModule {}
