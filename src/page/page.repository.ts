import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { Page } from './page.entity';

@EntityRepository(Page)
export class PageRepository extends Repository<Page> {
  async createPage(createPageDto: CreatePageDto, owner: User): Promise<Page> {
    const { title, isPrivate, type } = createPageDto;

    const page = this.create({
      title,
      private: isPrivate,
      type,
      owner,
    });

    await this.save(page);
    return page;
  }

  async getPageWithOwnerData(pageId: string): Promise<Page> {
    return await this.findOne(pageId, {
      relations: ['owner', 'members'],
    });
  }

  async addMember(page: Page, user: User): Promise<Page> {
    page.members = [...page.members, user];
    await this.save(page);

    return page;
  }
}
