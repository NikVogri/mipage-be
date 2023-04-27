import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from './log.repository';
import { LogService } from './log.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogRepository])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
