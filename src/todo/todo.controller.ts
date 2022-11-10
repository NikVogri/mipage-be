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
import { parseTodoForOutput } from './serializers/todo.serializer';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller({ path: '/pages/:pageId/todos' })
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async createTodo(
    @GetPage() page: Page,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    const todo = await this.todoService.createTodo(page, createTodoDto);
    return parseTodoForOutput(todo);
  }

  @Get()
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async getPageTodos(@GetPage() page: Page) {
    const todos = await this.todoService.getAllPageTodos(page);
    return todos.map(parseTodoForOutput);
  }

  @Get('/public')
  async getPublicPageTodos(@GetPage() page: Page) {
    if (page.private) {
      throw new ForbiddenException();
    }

    const todos = await this.todoService.getAllPageTodos(page);
    return todos.map(parseTodoForOutput);
  }

  @Patch('/:todoId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  async updateTodo(
    @GetTodo() todo: Todo,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const updatedTodo = await this.todoService.updateTodo(todo, updateTodoDto);
    return parseTodoForOutput(updatedTodo);
  }

  @Delete('/:todoId')
  @Roles('owner', 'member')
  @UseGuards(JwtAuthGuard, PageRolesGuard)
  deleteTodo(@GetTodo() todo: Todo) {
    return this.todoService.deleteTodo(todo);
  }
}
