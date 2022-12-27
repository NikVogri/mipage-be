import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page, PageType } from 'src/page/page.entity';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from './notebook.entity';
import { NotebookRepository } from './notebook.repository';

@Injectable()
export class NotebookService {
  constructor(
    @InjectRepository(NotebookRepository)
    private notebookRepository: NotebookRepository,
  ) {}

  async getAllPageNotebooks(page: Page): Promise<Notebook[]> {
    return this.notebookRepository.getAllPageNotebooks(page);
  }

  async createNotebook(
    page: Page,
    createNotebookDto: CreateNotebookDto,
  ): Promise<Notebook> {
    if (page.type !== PageType.notebook) {
      throw new BadRequestException(
        `Can not create notebook on page ${page.id} of type ${page.type}`,
      );
    }

    return this.notebookRepository.createNotebook(page, createNotebookDto);
  }

  async updateNotebook(
    notebook: Notebook,
    updateNotebookDto: UpdateNotebookDto,
  ): Promise<Notebook> {
    return await this.notebookRepository.updateSingleNotebook(
      notebook,
      updateNotebookDto,
    );
  }

  async getSingleNotebook(notebookId: string): Promise<Notebook> {
    const notebook = await this.notebookRepository.findOne(notebookId, {
      relations: ['blocks'],
    });

    if (!notebook) {
      throw new NotFoundException(
        `Todo block with id ${notebookId} does not exist`,
      );
    }

    return notebook;
  }
}
