import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notebook } from 'src/notebook/notebook.entity';
import { CreateNotebookBlockDto } from './dto/create-notebook-block.dto';
import { UpdateNotebookBlockDto } from './dto/update-notebook-block.dto';
import { NotebookBlock } from './notebook-block.entity';
import { NotebookBlockRepository } from './notebook-block.repository';

@Injectable()
export class NotebookBlockService {
  constructor(
    @InjectRepository(NotebookBlockRepository)
    private notebookBlockRepository: NotebookBlockRepository,
  ) {}

  async getSingleNotebookBlock(noteblockId: string) {
    const notebookBlock = await this.notebookBlockRepository.findOne(
      noteblockId,
    );

    if (!notebookBlock) {
      throw new NotFoundException(
        `Notebook block with id ${noteblockId} does not exist`,
      );
    }

    return notebookBlock;
  }

  async getAllNotebookBlocks(notebook: Notebook) {
    return await this.notebookBlockRepository.find({ notebook });
  }

  async createNotebookBlock(
    notebook: Notebook,
    createNotebookBlockDto: CreateNotebookBlockDto,
  ) {
    return await this.notebookBlockRepository.createNotebookBlock(
      notebook,
      createNotebookBlockDto,
    );
  }

  async deleteNotebookBlock(notebookBlock: NotebookBlock) {
    await this.notebookBlockRepository.remove(notebookBlock);
  }

  async updateNotebookBlock(
    notebookBlock: NotebookBlock,
    updateNotebookBlockDto: UpdateNotebookBlockDto,
  ) {
    return await this.notebookBlockRepository.updateNotebookBlock(
      notebookBlock,
      updateNotebookBlockDto,
    );
  }
}
