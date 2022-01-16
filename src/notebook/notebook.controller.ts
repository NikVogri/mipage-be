import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { NotebookBlockService } from 'src/notebook-block/notebook-block.service';
import { GetPage } from 'src/page/get-page.decorator';
import { PageRolesGuard } from 'src/page/guards/page-roles.guard';
import { Page } from 'src/page/page.entity';
import { Roles } from 'src/page/roles.decorator';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { GetNotebook } from './get-notebook.decorator';
import { Notebook } from './notebook.entity';
import { NotebookService } from './notebook.service';

@Controller({ path: '/pages/:pageId/notebooks' })
export class NotebookController {
  constructor(
    private notebookService: NotebookService,
    private notebookBlockService: NotebookBlockService,
  ) {}

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  getPageNotebooks(@GetPage() page: Page) {
    return this.notebookService.getAllPageNotebooks(page);
  }

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  createNotebook(
    @GetPage() page: Page,
    @Body() createNotebookDto: CreateNotebookDto,
  ) {
    return this.notebookService.createNotebook(page, createNotebookDto);
  }

  @Patch('/:notebookId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  updateNotebook(
    @GetNotebook() notebook: Notebook,
    @Body() updateNotebookDto: UpdateNotebookDto,
  ) {
    return this.notebookService.updateNotebook(notebook, updateNotebookDto);
  }

  @Get('/:notebookId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getSingleNotebook(@GetNotebook() notebook: Notebook) {
    const notebookBlocks = await this.notebookBlockService.getAllNotebookBlocks(
      notebook,
    );

    return {
      ...notebook,
      blocks: notebookBlocks,
    };
  }
}
