import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
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
  constructor(private notebookService: NotebookService) {}

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  getPageTodos(@GetPage() page: Page) {
    return this.notebookService.getAllPageNotebooks(page);
  }

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  createTodo(
    @GetPage() page: Page,
    @Body() createNotebookDto: CreateNotebookDto,
  ) {
    return this.notebookService.createNotebook(page, createNotebookDto);
  }

  @Patch('/:notebookId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  updateTodo(
    @GetNotebook() notebook: Notebook,
    @Body() updateNotebookDto: UpdateNotebookDto,
  ) {
    return this.notebookService.updateNotebook(notebook, updateNotebookDto);
  }
}
