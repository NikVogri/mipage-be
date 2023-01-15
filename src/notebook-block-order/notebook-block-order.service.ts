import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotebookRepository } from 'src/notebook/notebook.repository';
import { Notebook } from 'src/notebook/notebook.entity';

@Injectable()
export class NotebookBlockOrderService {
  constructor(
    @InjectRepository(NotebookRepository)
    private notebookRepository: NotebookRepository,
  ) {}

  async updateOrder(notebook: Notebook, order: string[]): Promise<void> {
    await this.notebookRepository.save({
      ...notebook,
      order: order,
    });
  }

  async addBlockToOrder(
    notebook: Notebook,
    blockId: string,
    prevBlockId?: string,
  ): Promise<string[]> {
    const order = notebook.order ? [...notebook.order] : [];
    let targetIndex = order.length;

    // If a valid 'prevBlockId' is present then a block was added in the middle of the list, which
    // means the target index is the index of the previous block plus one.
    if (prevBlockId) {
      const prevBlockIndex = order.findIndex((id) => id === prevBlockId);
      targetIndex = prevBlockIndex + 1;
    }

    order.splice(targetIndex, 0, blockId);
    await this.updateOrder(notebook, order);

    return order;
  }

  async changeBlockPosition(
    notebook: Notebook,
    movedBlockId: string,
    previousBlockId: string,
  ) {
    let order = notebook.order ? [...notebook.order] : [];

    if (movedBlockId === previousBlockId) {
      throw new BadRequestException();
    }

    const currBlockIndex = order.findIndex((id) => id === movedBlockId);
    const prevBlockIndex = order.findIndex((id) => id === previousBlockId);

    if (currBlockIndex === -1 || prevBlockIndex === -1) {
      throw new BadRequestException();
    }

    order.splice(currBlockIndex, 1, null); // Replace moved ID with temporary null value
    order.splice(prevBlockIndex + 1, 0, movedBlockId); // Place block ID in correct spot
    order = order.filter((order) => order); // Remove temporary null value

    await this.updateOrder(notebook, order);

    return order;
  }
}
