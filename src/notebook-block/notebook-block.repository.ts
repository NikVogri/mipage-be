import { Notebook } from 'src/notebook/notebook.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNotebookBlockDto } from './dto/create-notebook-block.dto';
import { UpdateNotebookBlockDto } from './dto/update-notebook-block.dto';
import { NotebookBlock } from './notebook-block.entity';

@EntityRepository(NotebookBlock)
export class NotebookBlockRepository extends Repository<NotebookBlock> {
  async getAllNotebookBlocks(notebook: Notebook): Promise<NotebookBlock[]> {
    return await this.find({ where: { id: notebook.id } });
  }

  async createNotebookBlock(
    notebook: Notebook,
    createNotebookBlockDto: CreateNotebookBlockDto,
  ): Promise<NotebookBlock> {
    // For some reason TypeOrm does not support inserting rows that have relationships with ID, instead
    // it requires relationship entity instance.
    // Because of the reason mentioned above an issue occurs where the new record has 'notebookId' field
    // empty when the 'notebook' entity instance is passed directly. Deleting 'blocks' array solves this issue.
    delete notebook.blocks;

    return await this.save({
      content: '',
      type: createNotebookBlockDto.type,
      notebook,
    });
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
