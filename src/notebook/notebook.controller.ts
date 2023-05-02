import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { parseNotebookForOutput } from './serializers/notebook.serializer';

@Controller({ path: '/pages/:pageId/notebooks' })
export class NotebookController {
  constructor(private notebookService: NotebookService) {}

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
    return parseNotebookForOutput(notebook);
  }

  @Get('/:notebookId/public')
  async getSingleNotebookPublic(
    @GetPage() page: Page,
    @GetNotebook() notebook: Notebook,
  ) {
    if (page.private) {
      throw new ForbiddenException();
    }

    return parseNotebookForOutput(notebook);
  }
}
