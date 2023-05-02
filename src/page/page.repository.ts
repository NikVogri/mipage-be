import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
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
    return await this.findOne(
      { id: pageId },
      {
        relations: ['owner', 'members', 'notebooks'],
      },
    );
  }

  async addMember(page: Page, user: User): Promise<Page> {
    page.members = [...page.members, user];
    await this.save(page);

    return page;
  }

  async getUserAssociatedPages(user: User): Promise<Page[]> {
    return await this.createQueryBuilder('page')
      .leftJoinAndSelect('page.notebooks', 'notebooks')
      .leftJoinAndSelect('page.members', 'member')
      .leftJoinAndSelect('page.owner', 'owner')
      .where('member.id = :memberId', { memberId: user.id })
      .orWhere('owner.id = :ownerId', { ownerId: user.id })
      .orderBy('page."updatedAt"', 'DESC')
      .getMany();
  }

  async updatePage(page: Page, updatePageDto: UpdatePageDto): Promise<Page> {
    const updated: Page = {
      ...page,
      title: updatePageDto.title,
      private: updatePageDto.isPrivate,
    };

    await this.save(updated);
    return updated;
  }
}
