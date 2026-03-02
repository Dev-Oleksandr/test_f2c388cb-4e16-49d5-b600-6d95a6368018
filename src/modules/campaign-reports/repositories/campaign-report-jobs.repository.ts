import { InjectRepository } from '@nestjs/typeorm';
import { CampaignReportJob } from '../entities/campaign-report-job.entity.js';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignReportJobRepository {
  constructor(
    @InjectRepository(CampaignReportJob)
    private readonly campaignReportJobRepository: Repository<CampaignReportJob>,
  ) {}

  create(data: DeepPartial<CampaignReportJob>) {
    return this.campaignReportJobRepository.save(data);
  }

  getByCondition(condition: FindOptionsWhere<CampaignReportJob>) {
    return this.campaignReportJobRepository.findOneBy(condition);
  }

  update(id: string, data: Partial<CampaignReportJob>) {
    return this.campaignReportJobRepository.update(id, data);
  }
}
