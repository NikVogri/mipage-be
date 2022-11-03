import {
  Body,
  Controller,
  Delete,
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
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodo } from './get-todo.decorator';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller({ path: '/pages/:pageId/todos' })
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  createTodo(@GetPage() page: Page, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(page, createTodoDto);
  }

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  getPageTodos(@GetPage() page: Page) {
    return this.todoService.getAllPageTodos(page);
  }

  @Get('/public')
  getPublicPageTodos(@GetPage() page: Page) {
    if (page.private) {
      throw new ForbiddenException();
    }

    return this.todoService.getAllPageTodos(page);
  }

  @Patch('/:todoId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  updateTodo(@GetTodo() todo: Todo, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo(todo, updateTodoDto);
  }

  @Delete('/:todoId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  deleteTodo(@GetTodo() todo: Todo) {
    return this.todoService.deleteTodo(todo);
  }
}
