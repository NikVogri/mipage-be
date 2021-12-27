import { EntityRepository, Repository } from 'typeorm';
import { Log } from './log.entity';

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {
  async saveLog(log: string): Promise<void> {
    const logEntity = this.create({
      content: log,
    });

    await this.save(logEntity);
  }
}
