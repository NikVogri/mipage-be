import { Page } from 'src/page/page.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from './notebook.entity';

@EntityRepository(Notebook)
export class NotebookRepository extends Repository<Notebook> {
  async getAllPageNotebooks(page: Page): Promise<Notebook[]> {
    return await this.find({ where: { id: page.id }, select: ['id', 'title'] });
  }
  async createNotebook(
    page: Page,
    createNotebookDto: CreateNotebookDto,
  ): Promise<Notebook> {
    const { title } = createNotebookDto;

    const notebook = this.create({ title, page });
    await this.save(notebook);
    delete notebook.page;
    return notebook;
  }
  async updateSingleNotebook(
    notebook: Notebook,
    updateNotebookDto: UpdateNotebookDto,
  ): Promise<Notebook> {
    console.log(notebook, updateNotebookDto);
    const updated = { ...notebook, ...updateNotebookDto };

    await this.save(updated);
    return updated;
  }
}
