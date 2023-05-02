import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotebookBlockOrderService } from 'src/notebook-block-order/notebook-block-order.service';
import { Notebook } from 'src/notebook/notebook.entity';
import { EntityManager, getConnection } from 'typeorm';
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
    const notebookBlock = await this.notebookBlockRepository.findOne({
      id: noteblockId,
    });

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

    const newOrder = await this.notebookBlockOrderService.addBlockToOrder(
      notebook,
      notebookBlock.id,
      createNotebookBlockDto.previousBlockId,
    );

    return {
      block: notebookBlock,
      order: newOrder,
    };
  }

  async deleteNotebookBlock(notebook: Notebook, notebookBlock: NotebookBlock) {
    const removedBlockId = notebookBlock.id;

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(NotebookBlock)
        .remove(notebookBlock);

      await queryRunner.manager.getRepository(Notebook).update(notebook.id, {
        order: notebook.order.filter((id) => id !== removedBlockId),
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
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
