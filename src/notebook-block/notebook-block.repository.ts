import { Notebook } from 'src/notebook/notebook.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNotebookBlockDto } from './dto/create-notebook-block.dto';
import { UpdateNotebookBlockDto } from './dto/update-notebook-block.dto';
import { NotebookBlock } from './notebook-block.entity';

@EntityRepository(NotebookBlock)
export class NotebookBlockRepository extends Repository<NotebookBlock> {
  async getAllNotebookBlocks(notebook: Notebook): Promise<NotebookBlock[]> {
    return await this.find({ where: { notebook } });
  }

  async createNotebookBlock(
    notebook: Notebook,
    createNotebookBlockDto: CreateNotebookBlockDto,
  ): Promise<NotebookBlock> {
    const { content, type } = createNotebookBlockDto;
    const notebookBlock = this.create({ content, type, notebook });

    await this.save(notebookBlock);
    delete notebookBlock.notebook;
    return notebookBlock;
  }

  async updateNotebookBlock(
    notebookBlock: NotebookBlock,
    updateNotebookBlockDto: UpdateNotebookBlockDto,
  ): Promise<NotebookBlock> {
    const updated = { ...notebookBlock, ...updateNotebookBlockDto };

    await this.save(updated);
    return updated;
  }
}
