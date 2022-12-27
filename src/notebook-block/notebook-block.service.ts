import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotebookBlockOrderService } from 'src/notebook-block-order/notebook-block-order.service';
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
    private notebookBlockOrderService: NotebookBlockOrderService,
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
    return await this.notebookBlockRepository.find({
      where: { notebook },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async createNotebookBlock(
    notebook: Notebook,
    createNotebookBlockDto: CreateNotebookBlockDto,
  ) {
    const notebookBlock =
      await this.notebookBlockRepository.createNotebookBlock(
        notebook,
        createNotebookBlockDto,
      );

    await this.notebookBlockOrderService.addBlock(
      notebook,
      notebookBlock.id,
      createNotebookBlockDto.previousBlockId,
    );

    return notebookBlock;
  }

  async deleteNotebookBlock(notebook: Notebook, notebookBlock: NotebookBlock) {
    await this.notebookBlockRepository.remove(notebookBlock);
    await this.notebookBlockOrderService.removeBlock(
      notebook,
      notebookBlock.id,
    );
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
