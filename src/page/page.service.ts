import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotebookService } from 'src/notebook/notebook.service';
import { User } from 'src/user/user.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { Page, PageType } from './page.entity';
import { PageRepository } from './page.repository';
import {
  OutputPage,
  parsePageForMinOutput,
  parsePageForOutput,
} from './serializers/page.serializer';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(PageRepository) private pageRepository: PageRepository,
    private notebookService: NotebookService,
  ) {}

  async createPage(
    createPageDto: CreatePageDto,
    owner: User,
  ): Promise<{ id: string }> {
    const page = await this.pageRepository.createPage(createPageDto, owner);

    // Also create a first notebook block
    if (page.type === PageType.notebook) {
      const notebook = await this.notebookService.createNotebook(page, {
        title: 'My notebook #1',
      });

      page.notebooks = [notebook];
    }

    return parsePageForOutput(page);
  }

  async deletePage(page: Page): Promise<void> {
    await this.pageRepository.delete({ id: page.id });
  }

  async getUserAssociatedPages(user: User): Promise<Page[]> {
    const associatedPages = await this.pageRepository
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.notebooks', 'notebooks')
      .leftJoinAndSelect('page.members', 'member')
      .leftJoinAndSelect('page.owner', 'owner')
      .where('member.id = :memberId', { memberId: user.id })
      .orWhere('owner.id = :ownerId', { ownerId: user.id })
      .orderBy('page."updatedAt"', 'DESC')
      .getMany();

    return associatedPages;
  }

  async getAllUserPages(user: User): Promise<OutputPage[]> {
    const associatedPages = await this.getUserAssociatedPages(user);
    return associatedPages.map((page) => ({
      ...parsePageForOutput(page),
    }));
  }

  async getAllUserPagesForSidebar(user: User) {
    const associatedPages = await this.getUserAssociatedPages(user);
    return associatedPages.map((page) => parsePageForMinOutput(page));
  }

  async getSinglePage(pageId: string): Promise<Page> {
    const page = await this.pageRepository.getPageWithOwnerData(pageId);

    if (!page) {
      throw new NotFoundException(`Page with id ${pageId} does not exist`);
    }

    return page;
  }
}
