import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetNotebook } from 'src/notebook/get-notebook.decorator';
import { Notebook } from 'src/notebook/notebook.entity';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { Roles } from 'src/page/roles.decorator';
import { UpdateNotebookBlockOrderDto } from './dto/update-notebook-block-order.dto';
import { NotebookBlockOrderService } from './notebook-block-order.service';

@Controller({ path: '/pages/:pageId/notebooks/:notebookId/order' })
export class NotebookBlockOrderController {
  constructor(private notebookOrderService: NotebookBlockOrderService) {}

  @Patch()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updateNotebookBlockOrder(
    @GetNotebook() notebook: Notebook,
    @Body() { movedBlockId, previousBlockId }: UpdateNotebookBlockOrderDto,
  ) {
    return await this.notebookOrderService.changeBlockPosition(
      notebook,
      movedBlockId,
      previousBlockId,
    );
  }
}
