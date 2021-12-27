import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetNotebook } from 'src/notebook/get-notebook.decorator';
import { Notebook } from 'src/notebook/notebook.entity';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { Roles } from 'src/page/roles.decorator';
import { CreateNotebookBlockDto } from './dto/create-notebook-block.dto';
import { UpdateNotebookBlockDto } from './dto/update-notebook-block.dto';
import { GetNotebookBlock } from './get-notebook-block.decorator';
import { NotebookBlock } from './notebook-block.entity';
import { NotebookBlockService } from './notebook-block.service';

@Controller('/pages/:pageId/notebooks/:notebookId/notebook-blocks')
export class NotebookBlockController {
  constructor(private notebookBlockService: NotebookBlockService) {}

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getAllNotebookBlocks(@GetNotebook() notebook: Notebook) {
    return this.notebookBlockService.getAllNotebookBlocks(notebook);
  }

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async crateNotebookBlock(
    @GetNotebook() notebook: Notebook,
    @Body() createNotebookBlockDto: CreateNotebookBlockDto,
  ) {
    return this.notebookBlockService.createNotebookBlock(
      notebook,
      createNotebookBlockDto,
    );
  }

  @Delete('/:noteblockId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async deleteNotebookBlock(@GetNotebookBlock() notebookBlock: NotebookBlock) {
    return this.notebookBlockService.deleteNotebookBlock(notebookBlock);
  }

  @Patch('/:noteblockId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updateNotebookBlock(
    @GetNotebookBlock() notebookBlock: NotebookBlock,
    @Body() updateNotebookBlockDto: UpdateNotebookBlockDto,
  ) {
    return this.notebookBlockService.updateNotebookBlock(
      notebookBlock,
      updateNotebookBlockDto,
    );
  }
}
