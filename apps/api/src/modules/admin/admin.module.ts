import { Module } from '@nestjs/common';
import { InstructorsModule } from '../instructors/instructors.module';
import { SchoolsModule } from '../schools/schools.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, InstructorsModule, SchoolsModule],
  controllers: [AdminController],
})
export class AdminModule {}
